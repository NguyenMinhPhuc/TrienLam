import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM Products ORDER BY Year DESC, Id DESC');
    return NextResponse.json(result.recordset);
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Name, Description, ImageUrl, AppUrl, TechTags, CareerPath, Year, Author } = body;

    await execute(
      `INSERT INTO Products (Name, Description, ImageUrl, AppUrl, TechTags, CareerPath, Year, Author, IsVisible)
       VALUES (@Name, @Description, @ImageUrl, @AppUrl, @TechTags, @CareerPath, @Year, @Author, 1)`,
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
    const { Id, Name, Description, ImageUrl, AppUrl, TechTags, CareerPath, Year, Author, IsVisible } = body;
    const hasVisibility = typeof IsVisible === 'boolean';
    const params = {
      Id,
      Name,
      Description,
      ImageUrl,
      AppUrl,
      TechTags,
      CareerPath,
      Year,
      Author,
      ...(hasVisibility ? { IsVisible } : {}),
    };

    await execute(
      `UPDATE Products SET Name = @Name, Description = @Description, ImageUrl = @ImageUrl, 
       AppUrl = @AppUrl, TechTags = @TechTags, CareerPath = @CareerPath, Year = @Year, Author = @Author,
       ${hasVisibility ? 'IsVisible = @IsVisible' : 'IsVisible = IsVisible'}
       WHERE Id = @Id`,
      params
    );

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error('Update Error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = Number(body?.Id);
    const isVisible = body?.IsVisible;

    if (!Number.isInteger(id) || typeof isVisible !== 'boolean') {
      return NextResponse.json({ error: 'Id and IsVisible are required' }, { status: 400 });
    }

    await execute('UPDATE Products SET IsVisible = @IsVisible WHERE Id = @Id', {
      Id: id,
      IsVisible: isVisible,
    });

    return NextResponse.json({ message: isVisible ? 'Product shown' : 'Product hidden', IsVisible: isVisible });
  } catch (err) {
    console.error('Visibility update error:', err);
    return NextResponse.json({ error: 'Visibility update failed' }, { status: 500 });
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
