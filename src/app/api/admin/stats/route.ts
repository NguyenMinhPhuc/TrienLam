import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const result = await query('SELECT * FROM Stats ORDER BY OrderIndex ASC');
    return NextResponse.json(result.recordset);
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Label, Value, IconName, OrderIndex } = body;

    await execute(
      'INSERT INTO Stats (Label, Value, IconName, OrderIndex) VALUES (@Label, @Value, @IconName, @OrderIndex)',
      { Label, Value, IconName, OrderIndex }
    );

    return NextResponse.json({ message: 'Stat created successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { Id, Label, Value, IconName, OrderIndex } = body;

    await execute(
      'UPDATE Stats SET Label = @Label, Value = @Value, IconName = @IconName, OrderIndex = @OrderIndex WHERE Id = @Id',
      { Id, Label, Value, IconName, OrderIndex }
    );

    return NextResponse.json({ message: 'Stat updated successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Id required' }, { status: 400 });

    await execute('DELETE FROM Stats WHERE Id = @id', { id: parseInt(id) });
    return NextResponse.json({ message: 'Stat deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
