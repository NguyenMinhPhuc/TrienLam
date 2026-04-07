import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const result = await query('SELECT * FROM Products ORDER BY Year DESC, Id DESC');
    return NextResponse.json(result.recordset);
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Name, Description, ImageUrl, AppUrl, TechTags, CareerPath, Year, Author } = body;

    await execute(
      `INSERT INTO Products (Name, Description, ImageUrl, AppUrl, TechTags, CareerPath, Year, Author) 
       VALUES (@Name, @Description, @ImageUrl, @AppUrl, @TechTags, @CareerPath, @Year, @Author)`,
      { Name, Description, ImageUrl, AppUrl, TechTags, CareerPath, Year, Author }
    );

    return NextResponse.json({ message: 'Product created successfully' });
  } catch (err) {
    console.error('Insert Error:', err);
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { Id, Name, Description, ImageUrl, AppUrl, TechTags, CareerPath, Year, Author } = body;

    await execute(
      `UPDATE Products SET Name = @Name, Description = @Description, ImageUrl = @ImageUrl, 
       AppUrl = @AppUrl, TechTags = @TechTags, CareerPath = @CareerPath, Year = @Year, Author = @Author 
       WHERE Id = @Id`,
      { Id, Name, Description, ImageUrl, AppUrl, TechTags, CareerPath, Year, Author }
    );

    return NextResponse.json({ message: 'Product updated successfully' });
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

    await execute('DELETE FROM Products WHERE Id = @id', { id: parseInt(id) });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
