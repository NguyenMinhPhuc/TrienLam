import { NextRequest, NextResponse } from 'next/server';
import { cmsResponse } from '@/lib/cms-response';
import { execute } from '@/lib/db';
import { revalidatePath } from 'next/cache';

function revalidateSections() {
  revalidatePath('/');
  revalidatePath('/academic');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get('pageKey') || 'home';
    const result = await execute(`SELECT * FROM CustomSections
      WHERE PageKey = @pageKey OR (@pageKey <> 'all' AND PageKey = 'all')
        OR (@pageKey = 'home' AND (PageKey IS NULL OR PageKey = ''))
      ORDER BY OrderIndex ASC, Id ASC`, { pageKey });
    return NextResponse.json(result.recordset);
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive, PageKey } = body;
    const validation = validateSection(body);
    if (validation) return NextResponse.json({ error: validation }, { status: 400 });

    await execute(
      `INSERT INTO CustomSections (Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive, PageKey) 
       VALUES (@Title, @Subtitle, @LayoutType, @ContentJson, @BgStyle, @OrderIndex, @IsActive, @PageKey)`,
      { Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive: IsActive ? 1 : 0, PageKey: PageKey || 'home' }
    );

    revalidateSections();

    return cmsResponse({ message: 'Section created successfully' });
  } catch (err) {
    console.error('Insert Error:', err);
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { Id, Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive, PageKey } = body;
    const validation = validateSection(body);
    if (validation) return NextResponse.json({ error: validation }, { status: 400 });

    await execute(
      `UPDATE CustomSections SET Title = @Title, Subtitle = @Subtitle, LayoutType = @LayoutType, 
       ContentJson = @ContentJson, BgStyle = @BgStyle, OrderIndex = @OrderIndex, IsActive = @IsActive, PageKey = @PageKey 
       WHERE Id = @Id`,
      { Id: parseInt(Id), Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive: IsActive ? 1 : 0, PageKey: PageKey || 'home' }
    );

    revalidateSections();

    return cmsResponse({ message: 'Section updated successfully' });
  } catch (err) {
    console.error('Update Error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

function validateSection(body: Record<string, unknown>): string | null {
  if (typeof body.Title !== 'string' || !body.Title.trim()) return 'Vui lòng nhập tiêu đề khung.';
  if (!['home', 'academic', 'all'].includes(String(body.PageKey || 'home'))) return 'Trang hiển thị không hợp lệ.';
  if (!['1-col', '2-col', '3-col', '4-col', 'timeline', 'product-showcase', 'script-embed'].includes(String(body.LayoutType))) return 'Bố cục không hợp lệ.';
  if (!Number.isInteger(body.OrderIndex)) return 'Thứ tự phải là số nguyên.';
  try {
    const parsed = JSON.parse(String(body.ContentJson));
    const items = Array.isArray(parsed) ? parsed : [parsed];
    if (items.some(item => !item || typeof item !== 'object' || Array.isArray(item) || Object.values(item).some(value => typeof value !== 'string'))) {
      return 'Nội dung JSON phải là danh sách các thành phần có giá trị văn bản.';
    }
  } catch { return 'Nội dung JSON không hợp lệ.'; }
  return null;
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Id required' }, { status: 400 });

    await execute('DELETE FROM CustomSections WHERE Id = @id', { id: parseInt(id) });
    revalidateSections();
    return cmsResponse({ message: 'Section deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
