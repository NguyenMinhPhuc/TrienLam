import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const result = await query('SELECT * FROM SiteContent');
    return NextResponse.json(result.recordset);
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { SectionKey, Content } = body;

    // Check if key exists
    const check = await execute('SELECT * FROM SiteContent WHERE SectionKey = @SectionKey', { SectionKey });
    
    if (check.recordset.length > 0) {
      await execute('UPDATE SiteContent SET Content = @Content WHERE SectionKey = @SectionKey', { SectionKey, Content });
    } else {
      await execute('INSERT INTO SiteContent (SectionKey, Content) VALUES (@SectionKey, @Content)', { SectionKey, Content });
    }

    return NextResponse.json({ message: 'Content updated successfully' });
  } catch (err) {
    console.error('Content Update Error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
