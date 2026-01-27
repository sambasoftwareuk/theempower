// lib/queries.js
import { query } from "@/lib/db";

/**
 * DEBUG helper:
 * Belirli bir slug için hangi locale'lerde içerik var görebilmek için.
 */
export async function debugGetLocalesForSlug(slug) {
  return await query(
    `
    SELECT
      cl.content_id,
      cl.slug,
      l.code AS locale_code,
      cl.title
    FROM content_locales cl
    JOIN locales l ON l.id = cl.locale_id
    WHERE cl.slug = ?
    `,
    [slug]
  );
}

/**
 * Tek bir içeriği slug + locale ile getirir.
 * - Önce istenen locale
 * - Hero alt_text için default locale fallback (is_default = 1)
 */
export async function getContentBySlug(slug, localeCode = "en") {
  const rows = await query(
    `
    SELECT
      c.id,
      c.is_published,
      c.published_at,
      c.hero_media_id,

      cl.title,
      cl.excerpt,
      cl.body_richtext,
      cl.slug,

      m.file_path AS hero_file_path,

      COALESCE(
        ml_req.alt_text,
        ml_def.alt_text
      ) AS hero_alt_text

    FROM content_locales cl
    JOIN contents c
      ON c.id = cl.content_id

    JOIN locales l_req
      ON l_req.id = cl.locale_id
     AND l_req.code = ?

    LEFT JOIN media m
      ON m.id = c.hero_media_id

    -- default locale (is_default = 1)
    LEFT JOIN locales l_def
      ON l_def.is_default = 1

    LEFT JOIN media_locales ml_req
      ON ml_req.media_id = m.id
     AND ml_req.locale_id = l_req.id

    LEFT JOIN media_locales ml_def
      ON ml_def.media_id = m.id
     AND ml_def.locale_id = l_def.id

    WHERE cl.slug = ?
    LIMIT 1
    `,
    [localeCode, slug]
  );

  if (rows.length === 0) return null;
  const r = rows[0];

  /**
   * 1) Bu content hangi grupta?
   * (birden fazla olabilir, ilkini alıyoruz)
   */
  const groupRows = await query(
    `
    SELECT content_group_id
    FROM content_group_items
    WHERE content_id = ?
    ORDER BY sort_order ASC
    LIMIT 1
    `,
    [r.id]
  );

  const groupId = groupRows[0]?.content_group_id ?? null;

  /**
   * 2) Aynı gruptan son 3 içerik (mevcut içerik hariç)
   */
  let related = [];
  if (groupId) {
    related = await query(
      `
      SELECT
        c.id,
        c.published_at,
        cl.slug,
        cl.title,

        m.file_path AS hero_file_path,

        COALESCE(
          ml_req.alt_text,
          ml_def.alt_text
        ) AS hero_alt_text

      FROM content_group_items cgi
      JOIN contents c
        ON c.id = cgi.content_id
       AND c.is_published = 1
       AND c.published_at IS NOT NULL

      JOIN content_locales cl
        ON cl.content_id = c.id

      JOIN locales l_req
        ON l_req.id = cl.locale_id
       AND l_req.code = ?

      LEFT JOIN media m
        ON m.id = c.hero_media_id

      LEFT JOIN locales l_def
        ON l_def.is_default = 1

      LEFT JOIN media_locales ml_req
        ON ml_req.media_id = m.id
       AND ml_req.locale_id = l_req.id

      LEFT JOIN media_locales ml_def
        ON ml_def.media_id = m.id
       AND ml_def.locale_id = l_def.id

      WHERE cgi.content_group_id = ?
        AND c.id <> ?
      ORDER BY c.published_at DESC, c.id DESC
      LIMIT 3
      `,
      [localeCode, groupId, r.id]
    );
  }

  return {
    id: r.id,
    is_published: !!r.is_published,
    published_at: r.published_at,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    body_richtext: r.body_richtext,

    hero: {
      media_id: r.hero_media_id,
      file_path: r.hero_file_path,
      alt_text: r.hero_alt_text || r.title || "",
    },

    related: related.map((x) => ({
      id: x.id,
      published_at: x.published_at,
      slug: x.slug,
      title: x.title,
      hero: {
        file_path: x.hero_file_path,
        alt_text: x.hero_alt_text || x.title || "",
      },
    })),
  };
}

/**
 * Belirli bir content + locale için locale datası
 */
export async function getContentLocale(contentId, localeCode = "en") {
  const rows = await query(
    `
    SELECT
      cl.id,
      cl.content_id,
      cl.title,
      cl.excerpt,
      cl.body_richtext,
      cl.slug,
      l.code AS locale_code
    FROM content_locales cl
    JOIN locales l ON l.id = cl.locale_id
    WHERE cl.content_id = ?
      AND l.code = ?
    LIMIT 1
    `,
    [contentId, localeCode]
  );

  if (rows.length === 0) return null;
  return rows[0];
}

/**
 * Bir content_group'u group_key ile,
 * child gruplar + içeriklerle birlikte döner.
 */
export async function getGroupTreeByKey(groupKey, localeCode = "en") {
  // 1) Ana grup (önce locale ile)
  const groupsLocale = await query(
    `
    SELECT
      cg.id,
      cg.parent_id,
      cg.group_key,
      cg.sort_order,
      cgl.name,
      cgl.description,
      l.code AS locale_code
    FROM content_groups cg
    JOIN content_group_locales cgl ON cgl.content_group_id = cg.id
    JOIN locales l ON l.id = cgl.locale_id
    WHERE cg.group_key = ?
      AND l.code = ?
    LIMIT 1
    `,
    [groupKey, localeCode]
  );

  let group = null;

  if (groupsLocale.length > 0) {
    group = groupsLocale[0];
  } else {
    // fallback: locale filtresiz
    const groupsAny = await query(
      `
      SELECT
        cg.id,
        cg.parent_id,
        cg.group_key,
        cg.sort_order,
        cgl.name,
        cgl.description,
        l.code AS locale_code
      FROM content_groups cg
      JOIN content_group_locales cgl ON cgl.content_group_id = cg.id
      JOIN locales l ON l.id = cgl.locale_id
      WHERE cg.group_key = ?
      LIMIT 1
      `,
      [groupKey]
    );

    if (groupsAny.length === 0) return null;
    group = groupsAny[0];
  }

  // 2) Child gruplar
  const childrenGroups = await query(
    `
    SELECT
      cg.id,
      cg.parent_id,
      cg.group_key,
      cg.sort_order,
      cgl.name,
      cgl.description,
      l.code AS locale_code
    FROM content_groups cg
    JOIN content_group_locales cgl ON cgl.content_group_id = cg.id
    JOIN locales l ON l.id = cgl.locale_id
    WHERE cg.parent_id = ?
      AND l.code = ?
    ORDER BY cg.sort_order ASC, cgl.name ASC
    `,
    [group.id, group.locale_code]
  );

  // 3) Bu gruba bağlı içerikler
  const contents = await query(
    `
    SELECT
      c.id,
      c.is_published,
      c.published_at,
      cl.slug,
      cl.title,
      cl.excerpt,
      l.code AS locale_code
    FROM content_group_items cgi
    JOIN contents c ON c.id = cgi.content_id
    JOIN content_locales cl ON cl.content_id = c.id
    JOIN locales l ON l.id = cl.locale_id
    WHERE cgi.content_group_id = ?
      AND l.code = ?
    ORDER BY cgi.sort_order ASC, cl.title ASC
    `,
    [group.id, group.locale_code]
  );

  return {
    group,
    childrenGroups,
    contents,
  };
}

/**
 * Atomik yardımcılar
 */
export async function getGroupByKey(groupKey, localeCode = "en") {
  const rows = await query(
    `
    SELECT
      cg.id,
      cg.parent_id,
      cg.group_key,
      cg.sort_order,
      cgl.name,
      cgl.description,
      l.code AS locale_code
    FROM content_groups cg
    JOIN content_group_locales cgl ON cgl.content_group_id = cg.id
    JOIN locales l ON l.id = cgl.locale_id
    WHERE cg.group_key = ?
      AND l.code = ?
    LIMIT 1
    `,
    [groupKey, localeCode]
  );

  if (rows.length > 0) return rows[0];

  const fallback = await query(
    `
    SELECT
      cg.id,
      cg.parent_id,
      cg.group_key,
      cg.sort_order,
      cgl.name,
      cgl.description,
      l.code AS locale_code
    FROM content_groups cg
    JOIN content_group_locales cgl ON cgl.content_group_id = cg.id
    JOIN locales l ON l.id = cgl.locale_id
    WHERE cg.group_key = ?
    LIMIT 1
    `,
    [groupKey]
  );

  return fallback[0] || null;
}

export async function getChildGroups(parentGroupId, localeCode = "en") {
  return await query(
    `
    SELECT
      cg.id,
      cg.parent_id,
      cg.group_key,
      cg.sort_order,
      cgl.name,
      cgl.description,
      l.code AS locale_code
    FROM content_groups cg
    JOIN content_group_locales cgl ON cgl.content_group_id = cg.id
    JOIN locales l ON l.id = cgl.locale_id
    WHERE cg.parent_id = ?
      AND l.code = ?
    ORDER BY cg.sort_order ASC, cgl.name ASC
    `,
    [parentGroupId, localeCode]
  );
}

export async function getContentsForGroup(groupId, localeCode = "en") {
  return await query(
    `
    SELECT
      c.id,
      c.is_published,
      c.published_at,
      cl.slug,
      cl.title,
      cl.excerpt,
      l.code AS locale_code
    FROM content_group_items cgi
    JOIN contents c ON c.id = cgi.content_id
    JOIN content_locales cl ON cl.content_id = c.id
    JOIN locales l ON l.id = cl.locale_id
    WHERE cgi.content_group_id = ?
      AND l.code = ?
    ORDER BY cgi.sort_order ASC, cl.title ASC
    `,
    [groupId, localeCode]
  );
}

/**
 * Tüm section'lar + subtitle'lar
 */
export async function getAllSections(localeCode = "en") {
  const groups = await query(
    `
    SELECT
      cg.id AS group_id,
      cgl.name AS title
    FROM content_groups cg
    JOIN content_group_locales cgl ON cgl.content_group_id = cg.id
    JOIN locales l ON l.id = cgl.locale_id
    WHERE l.code = ?
    ORDER BY cg.sort_order ASC
    `,
    [localeCode]
  );

  const results = [];

  for (const group of groups) {
    const subtitles = await query(
      `
      SELECT 
        cl.id    AS id,
        cl.title AS title,
        cl.slug  AS slug
      FROM content_group_items cgi
      JOIN content_locales cl ON cl.content_id = cgi.content_id
      JOIN locales l ON l.id = cl.locale_id
      WHERE cgi.content_group_id = ?
        AND l.code = ?
      ORDER BY cgi.sort_order ASC
      `,
      [group.group_id, localeCode]
    );

    results.push({
      id: group.group_id,
      title: group.title,
      subtitles, // [{ id, title, slug }]
    });
  }

  return results;
}
/**
 * Ana sayfa slider slides'larını getirir
 * slider_key ile slider'ı bulur ve tüm aktif slide'ları döner
 */
export async function getMainSliderSlides(
  sliderKey = "main_page_slider",
  localeCode = "en"
) {
  return await query(
    `
    SELECT 
      ss.id,
      ss.title,
      ss.subtitle,
      ss.description,
      ss.sort_order,
      m.file_path AS image_link,
      COALESCE(ml_req.alt_text, ml_def.alt_text) AS image_alt
    FROM slider_slides ss
    JOIN sliders s ON s.id = ss.slider_id
    JOIN media m ON m.id = ss.media_id
    LEFT JOIN locales l_req ON l_req.code = ?
    LEFT JOIN media_locales ml_req ON ml_req.media_id = m.id AND ml_req.locale_id = l_req.id
    LEFT JOIN locales l_def ON l_def.is_default = 1
    LEFT JOIN media_locales ml_def ON ml_def.media_id = m.id AND ml_def.locale_id = l_def.id
    WHERE ss.is_visible = 1
      AND s.slider_key = ?
    ORDER BY ss.sort_order ASC
    `,
    [localeCode, sliderKey]
  );
}

export async function getSideMenuPagesBySlug(slug, localeCode = "en") {
  // 1️⃣ Current content + group info
  const current = await query(
    `
    SELECT 
      cl.content_id,
      cgi.content_group_id,
      cg.group_key
    FROM content_locales cl
    JOIN content_group_items cgi 
      ON cgi.content_id = cl.content_id
    JOIN content_groups cg
      ON cg.id = cgi.content_group_id
    WHERE cl.slug = ?
      AND cl.locale_id = (
        SELECT id FROM locales WHERE code = ?
      )
    LIMIT 1
    `,
    [slug, localeCode]
  );

  if (!current.length) return null;

  const {
    content_id: currentContentId,
    content_group_id,
    group_key,
  } = current[0];

  // 2️⃣ Side menu items (same group, exclude nulls)
  const items = await query(
    `
    SELECT 
      cgi.content_id,
      COALESCE(cl_req.title, cl_en.title) AS label,
      COALESCE(cl_req.slug, cl_en.slug) AS slug
    FROM content_group_items cgi
    LEFT JOIN content_locales cl_req
      ON cl_req.content_id = cgi.content_id
      AND cl_req.locale_id = (
        SELECT id FROM locales WHERE code = ?
      )
    LEFT JOIN content_locales cl_en
      ON cl_en.content_id = cgi.content_id
      AND cl_en.locale_id = 1
    WHERE cgi.content_group_id = ?
      AND (cl_req.title IS NOT NULL OR cl_en.title IS NOT NULL)
      AND (cl_req.slug IS NOT NULL OR cl_en.slug IS NOT NULL)
    ORDER BY cgi.sort_order
    `,
    [localeCode, content_group_id]
  );

  // 3️⃣ Map ve filtrele (ekstra güvenlik)
  const cleanItems = items
    .filter((item) => item.label && item.slug) // null olanları at
    .map((item) => ({
      label: item.label,
      slug: item.slug,
      href: `${item.slug}`, // Linki tam path olarak ver
    }));

  return {
    title: group_key || "Menu", // Başlık boşsa fallback
    items: cleanItems,
  };
}
