import { NextRequest, NextResponse } from 'next/server';
import { query, executeTransaction } from '@/lib/db';
import { cmsResponse } from '@/lib/cms-response';

interface ContentUpdate {
  SectionKey: unknown;
  Content: unknown;
}

function parseUpdates(body: { SectionKey?: unknown; Content?: unknown; items?: unknown }): Array<{ SectionKey: string; Content: string }> {
  const candidates: ContentUpdate[] = Array.isArray(body.items)
    ? body.items as ContentUpdate[]
    : [{ SectionKey: body.SectionKey, Content: body.Content }];

  return candidates.map((item) => {
    if (typeof item.SectionKey !== 'string' || !item.SectionKey.trim() || item.SectionKey.length > 100) {
      throw new Error('Khóa nội dung không hợp lệ.');
    }
    if (typeof item.Content !== 'string') {
      throw new Error(`Nội dung của ${item.SectionKey} không hợp lệ.`);
    }
    if (item.SectionKey === 'home_layout') {
      let layout: unknown;
      try { layout = JSON.parse(item.Content); } catch { throw new Error('Bố cục không hợp lệ.'); }
      if (!Array.isArray(layout) || layout.some(region => !region || typeof region.id !== 'string' || typeof region.visible !== 'boolean')) {
        throw new Error('Bố cục không hợp lệ.');
      }
    }
    return { SectionKey: item.SectionKey.trim(), Content: item.Content };
  });
}

export async function GET() {
  try {
    const result = await query('SELECT * FROM SiteContent');
    return NextResponse.json(result.recordset);
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updates = parseUpdates(await req.json());
    if (updates.length === 0) {
      return NextResponse.json({ error: 'Không có nội dung cần lưu.' }, { status: 400 });
    }

    await executeTransaction(updates.map(({ SectionKey, Content }) => ({
        sql: `IF EXISTS (SELECT 1 FROM SiteContent WITH (UPDLOCK, HOLDLOCK) WHERE SectionKey = @SectionKey)
          UPDATE SiteContent SET Content = @Content, LastUpdated = GETDATE() WHERE SectionKey = @SectionKey
         ELSE
          INSERT INTO SiteContent (SectionKey, Content) VALUES (@SectionKey, @Content)`,
        params: { SectionKey, Content },
    })));

    return cmsResponse({ message: 'Content updated successfully', updated: updates.length });
  } catch (err) {
    console.error('Content Update Error:', err);
    const message = err instanceof Error && err.message.includes('không hợp lệ') ? err.message : 'Không thể cập nhật nội dung.';
    return NextResponse.json({ error: message }, { status: message.includes('không hợp lệ') ? 400 : 500 });
  }
}
