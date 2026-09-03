import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const [questions, options, results, industries] = await Promise.all([
      query('SELECT * FROM QuizQuestions ORDER BY OrderIndex ASC'),
      query('SELECT * FROM QuizOptions ORDER BY QuestionId ASC, OrderIndex ASC'),
      query('SELECT * FROM QuizResults'),
      query('SELECT * FROM Industries')
    ]);

    return NextResponse.json({
      questions: questions.recordset,
      options: options.recordset,
      results: results.recordset,
      industries: industries.recordset
    });
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...data } = body;

    if (type === 'question') {
      const { QuestionText, OrderIndex } = data;
      await execute('INSERT INTO QuizQuestions (QuestionText, OrderIndex) VALUES (@QuestionText, @OrderIndex)', { QuestionText, OrderIndex });
    } else if (type === 'option') {
      const { QuestionId, OptionText, ResultType, OrderIndex } = data;
      await execute('INSERT INTO QuizOptions (QuestionId, OptionText, ResultType, OrderIndex) VALUES (@QuestionId, @OptionText, @ResultType, @OrderIndex)', { QuestionId, OptionText, ResultType, OrderIndex });
    } else if (type === 'result') {
      const { ResultKey, Title, Description, IconName, IndustryKey } = data;
      await execute('INSERT INTO QuizResults (ResultKey, Title, Description, IconName, IndustryKey) VALUES (@ResultKey, @Title, @Description, @IconName, @IndustryKey)', { ResultKey, Title, Description, IconName, IndustryKey });
    }

    return NextResponse.json({ message: 'Quiz item created' });
  } catch {
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
    try {
      const body = await req.json();
      const { type, ...data } = body;
  
      if (type === 'question') {
        const { Id, QuestionText, OrderIndex } = data;
        await execute('UPDATE QuizQuestions SET QuestionText = @QuestionText, OrderIndex = @OrderIndex WHERE Id = @Id', { Id, QuestionText, OrderIndex });
      } else if (type === 'option') {
        const { Id, OptionText, ResultType, OrderIndex } = data;
        await execute('UPDATE QuizOptions SET OptionText = @OptionText, ResultType = @ResultType, OrderIndex = @OrderIndex WHERE Id = @Id', { Id, OptionText, ResultType, OrderIndex });
      } else if (type === 'result') {
        const { Id, Title, Description, IconName, IndustryKey } = data;
        await execute('UPDATE QuizResults SET Title = @Title, Description = @Description, IconName = @IconName, IndustryKey = @IndustryKey WHERE Id = @Id', { Id, Title, Description, IconName, IndustryKey });
      }
  
      return NextResponse.json({ message: 'Quiz item updated' });
    } catch {
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      const type = searchParams.get('type');
  
      if (!id || !type) return NextResponse.json({ error: 'Id and Type required' }, { status: 400 });
  
      if (type === 'question') {
        await execute('DELETE FROM QuizQuestions WHERE Id = @id', { id: parseInt(id) });
      } else if (type === 'option') {
        await execute('DELETE FROM QuizOptions WHERE Id = @id', { id: parseInt(id) });
      } else if (type === 'result') {
        await execute('DELETE FROM QuizResults WHERE Id = @id', { id: parseInt(id) });
      }
  
      return NextResponse.json({ message: 'Quiz item deleted' });
    } catch {
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
