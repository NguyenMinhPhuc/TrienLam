import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const result = await query('SELECT SectionKey, Content FROM SiteContent');
    const content: Record<string, string> = {};
    result.recordset.forEach(item => {
      content[item.SectionKey] = item.Content;
    });
    return NextResponse.json(content);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
