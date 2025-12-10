// lib/queries.js
import { query } from '@/lib/db';

/**
 * DEBUG yardımcı: hangi locale'lerle hangi slug'lar var görebilmek için.
 * Bunu API'de veya geçici bir server component'te çağırıp loglayabilirsin.
 */
export async function debugGetLocalesForSlug(slug) {
  const rows = await query(
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
  return rows;
}

/**
 * Tek bir içeriği slug ile getirir.
 * 1) Önce verilen localeCode ile dener
 * 2) Bulamazsa locale filtresiz fallback yapar (development için çok işe yarıyor)
 *
 * Örnek kullanım:
 *   const content = await getContentBySlug('nhs-gp-registration', 'en');
 */
export async function getContentBySlug(slug, localeCode = 'en') {
  // 1) Locale filtreli deneme
  const rowsLocale = await query(
    `
    SELECT
      c.id,
      c.is_published,
      c.published_at,
      cl.title,
      cl.excerpt,
      cl.body_richtext,
      cl.slug,
      l.code AS locale_code
    FROM content_locales cl
    JOIN contents c ON c.id = cl.content_id
    JOIN locales l ON l.id = cl.locale_id
    WHERE cl.slug = ?
      AND l.code = ?
    LIMIT 1
    `,
    [slug, localeCode]
  );

  if (rowsLocale.length > 0) {
    return rowsLocale[0];
  }

  // 2) Fallback: aynı slug ama herhangi bir locale
  const rowsAny = await query(
    `
    SELECT
      c.id,
      c.is_published,
      c.published_at,
      cl.title,
      cl.excerpt,
      cl.body_richtext,
      cl.slug,
      l.code AS locale_code
    FROM content_locales cl
    JOIN contents c ON c.id = cl.content_id
    JOIN locales l ON l.id = cl.locale_id
    WHERE cl.slug = ?
    LIMIT 1
    `,
    [slug]
  );

  if (rowsAny.length === 0) return null;
  return rowsAny[0];
}

/**
 * Sadece belirli bir content_id + localeCode için locale datasını döner.
 * Şimdilik kullanmak zorunda değilsin, ama çok dilliliğe geçtiğimizde işimize yarar.
 */
export async function getContentLocale(contentId, localeCode = 'en') {
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
 * altındaki 1 seviye child gruplar + doğrudan bağlı içeriklerle birlikte döner.
 *
 * Örnek kullanım:
 *   const data = await getGroupTreeByKey('health_wellbeing', 'en');
 *   const { group, childrenGroups, contents } = data;
 */
export async function getGroupTreeByKey(groupKey, localeCode = 'en') {
  // 1) Ana grup — önce locale filtresi ile deniyoruz
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
    // 1.b) Fallback: locale filtresi olmadan grupla eşleşeni bul
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

  // 2) Child gruplar (bir seviye aşağı)
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
    [group.id, group.locale_code] // bulunduğu locale ile child'ları çekiyoruz
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
 * Daha atomik kullanımlar için:
 * - getGroupByKey
 * - getChildGroups
 * - getContentsForGroup
 */

export async function getGroupByKey(groupKey, localeCode = 'en') {
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

  if (groupsLocale.length > 0) return groupsLocale[0];

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
  return groupsAny[0];
}

export async function getChildGroups(parentGroupId, localeCode = 'en') {
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
    WHERE cg.parent_id = ?
      AND l.code = ?
    ORDER BY cg.sort_order ASC, cgl.name ASC
    `,
    [parentGroupId, localeCode]
  );

  return rows;
}

export async function getContentsForGroup(groupId, localeCode = 'en') {
  const rows = await query(
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

  return rows;
}
