import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get('pageKey') || 'home';
    const result = await execute('SELECT * FROM CustomSections WHERE PageKey = @pageKey ORDER BY OrderIndex ASC', { pageKey });
    return NextResponse.json(result.recordset);
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive, PageKey } = body;

    await execute(
      `INSERT INTO CustomSections (Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive, PageKey) 
       VALUES (@Title, @Subtitle, @LayoutType, @ContentJson, @BgStyle, @OrderIndex, @IsActive, @PageKey)`,
      { Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive: IsActive ? 1 : 0, PageKey: PageKey || 'home' }
    );

    return NextResponse.json({ message: 'Section created successfully' });
  } catch (err) {
    console.error('Insert Error:', err);
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { Id, Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive, PageKey } = body;

    await execute(
      `UPDATE CustomSections SET Title = @Title, Subtitle = @Subtitle, LayoutType = @LayoutType, 
       ContentJson = @ContentJson, BgStyle = @BgStyle, OrderIndex = @OrderIndex, IsActive = @IsActive, PageKey = @PageKey 
       WHERE Id = @Id`,
      { Id: parseInt(Id), Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive: IsActive ? 1 : 0, PageKey: PageKey || 'home' }
    );

    return NextResponse.json({ message: 'Section updated successfully' });
  } catch (err) {
    console.error('Update Error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Id required' }, { status: 400 });

    await execute('DELETE FROM CustomSections WHERE Id = @id', { id: parseInt(id) });
    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
