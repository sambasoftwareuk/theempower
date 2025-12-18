// app/api/debug/content-list/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const localeCode = searchParams.get('locale') || 'en';

    const rows = await query(
      `
      SELECT
        cl.content_id,
        cl.slug,
        cl.title,
        l.code AS locale_code
      FROM content_locales cl
      JOIN locales l ON l.id = cl.locale_id
      WHERE l.code = ?
      ORDER BY cl.content_id ASC
      `,
      [localeCode]
    );

    return NextResponse.json({
      localeCode,
      count: rows.length,
      items: rows,
    });
  } catch (err) {
    console.error('debug content-list error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
