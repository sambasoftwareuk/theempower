// app/api/db-test/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; // alias yoksa '../..' ile düzelt

export async function GET() {
  try {
    const rows = await query('SELECT 1 AS ok');
    return NextResponse.json({ rows });
  } catch (err) {
    console.error('DB test error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
