// app/api/debug/db-info/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const dbNameRows = await query('SELECT DATABASE() AS db');
    const dbName = dbNameRows[0]?.db || null;

    const locales = await query('SELECT id, code, name FROM locales');
    const contentCountRows = await query('SELECT COUNT(*) AS cnt FROM content_locales');
    const groupCountRows = await query('SELECT COUNT(*) AS cnt FROM content_groups');

    return NextResponse.json({
      dbName,
      locales,
      contentLocalesCount: contentCountRows[0]?.cnt || 0,
      contentGroupsCount: groupCountRows[0]?.cnt || 0,
    });
  } catch (err) {
    console.error('debug db-info error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
