import { NextRequest, NextResponse } from 'next/server';
import { query, execute, executeTransaction } from '@/lib/db';
import { cmsResponse } from '@/lib/cms-response';

const tables = { question: 'QuizQuestions', option: 'QuizOptions', result: 'QuizResults', industry: 'Industries' } as const;
type ItemType = keyof typeof tables;

class InputError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
function itemType(value: unknown): ItemType {
  if (typeof value !== 'string' || !Object.hasOwn(tables, value)) throw new InputError('Loại dữ liệu trắc nghiệm không hợp lệ.');
  return value as ItemType;
}
function required(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new InputError(`Vui lòng nhập ${label}.`);
  return value.trim();
}
function idValue(value: unknown): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new InputError('Mã dữ liệu không hợp lệ.');
  return id;
}
function errorResponse(error: unknown) {
  if (error instanceof InputError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error('Quiz mutation failed:', error);
  return NextResponse.json({ error: 'Không thể lưu dữ liệu. Kiểm tra mã bị trùng và thử lại.' }, { status: 500 });
}
async function existing(type: ItemType, id: number) {
  const response = await execute(`SELECT * FROM ${tables[type]} WHERE Id = @id`, { id });
  if (!response.recordset[0]) throw new InputError('Mục này không còn tồn tại. Vui lòng tải lại danh sách.', 404);
  return response.recordset[0];
}
export async function GET() {
  try {
    const [questions, options, results, industries] = await Promise.all([
      query('SELECT * FROM QuizQuestions ORDER BY OrderIndex ASC, Id ASC'),
      query('SELECT * FROM QuizOptions ORDER BY QuestionId ASC, OrderIndex ASC, Id ASC'),
      query('SELECT * FROM QuizResults ORDER BY Id ASC'),
      query('SELECT * FROM Industries ORDER BY Id ASC'),
    ]);
    return NextResponse.json({ questions: questions.recordset, options: options.recordset, results: results.recordset, industries: industries.recordset });
  } catch (error) { return errorResponse(error); }
}

async function save(req: NextRequest, update: boolean) {
  try {
    const data = await req.json();
    const type = itemType(data.type);
    const Id = update ? idValue(data.Id) : null;
    if (Id) await existing(type, Id);
    if (type === 'question' || type === 'option') {
      if (!Number.isInteger(data.OrderIndex)) throw new InputError('Thứ tự phải là số nguyên.');
    }
    if (type === 'question') {
      const QuestionText = required(data.QuestionText, 'nội dung câu hỏi');
      await execute(update
        ? 'UPDATE QuizQuestions SET QuestionText=@QuestionText, OrderIndex=@OrderIndex WHERE Id=@Id'
        : 'INSERT INTO QuizQuestions (QuestionText,OrderIndex) VALUES (@QuestionText,@OrderIndex)',
      { Id, QuestionText, OrderIndex: data.OrderIndex });
    } else if (type === 'option') {
      const QuestionId = idValue(data.QuestionId);
      await existing('question', QuestionId);
      const ResultType = required(data.ResultType, 'kết quả tương ứng');
      const result = await execute('SELECT Id FROM QuizResults WHERE ResultKey=@ResultType', { ResultType });
      if (!result.recordset.length) throw new InputError('Kết quả đã bị xóa. Hãy chọn kết quả khác.');
      const OptionText = required(data.OptionText, 'nội dung lựa chọn');
      await execute(update
        ? 'UPDATE QuizOptions SET QuestionId=@QuestionId, OptionText=@OptionText, ResultType=@ResultType, OrderIndex=@OrderIndex WHERE Id=@Id'
        : 'INSERT INTO QuizOptions (QuestionId,OptionText,ResultType,OrderIndex) VALUES (@QuestionId,@OptionText,@ResultType,@OrderIndex)',
      { Id, QuestionId, OptionText, ResultType, OrderIndex: data.OrderIndex });
    } else {
      const Title = required(data.Title, 'tiêu đề');
      const Description = typeof data.Description === 'string' ? data.Description : '';
      if (type === 'result') {
        const IndustryKey = data.IndustryKey || null;
        if (IndustryKey) {
          const industry = await execute('SELECT Id FROM Industries WHERE IndustryKey=@IndustryKey', { IndustryKey });
          if (!industry.recordset.length) throw new InputError('Ngành đã bị xóa. Hãy chọn ngành khác.');
        }
        const ResultKey = update ? null : required(data.ResultKey, 'mã kết quả');
        if (ResultKey && !/^[A-Za-z0-9_-]{1,50}$/.test(ResultKey)) throw new InputError('Mã kết quả dùng chữ không dấu, số, gạch nối; tối đa 50 ký tự.');
        if (ResultKey && (await execute('SELECT Id FROM QuizResults WHERE ResultKey=@ResultKey', { ResultKey })).recordset.length) throw new InputError('Mã kết quả đã tồn tại.');
        await execute(update
          ? 'UPDATE QuizResults SET Title=@Title,Description=@Description,IconName=@IconName,IndustryKey=@IndustryKey WHERE Id=@Id'
          : 'INSERT INTO QuizResults (ResultKey,Title,Description,IconName,IndustryKey) VALUES (@ResultKey,@Title,@Description,@IconName,@IndustryKey)',
        { Id, ResultKey, Title, Description, IconName: data.IconName || 'Briefcase', IndustryKey });
      } else {
        const IndustryKey = update ? null : required(data.IndustryKey, 'mã ngành');
        if (IndustryKey && !/^[A-Za-z0-9_-]{1,50}$/.test(IndustryKey)) throw new InputError('Mã ngành dùng chữ không dấu, số, gạch nối; tối đa 50 ký tự.');
        if (IndustryKey && (await execute('SELECT Id FROM Industries WHERE IndustryKey=@IndustryKey', { IndustryKey })).recordset.length) throw new InputError('Mã ngành đã tồn tại.');
        await execute(update
          ? 'UPDATE Industries SET Title=@Title,Description=@Description WHERE Id=@Id'
          : 'INSERT INTO Industries (IndustryKey,Title,Description) VALUES (@IndustryKey,@Title,@Description)',
        { Id, IndustryKey, Title, Description });
      }
    }
    return cmsResponse({ message: 'Đã lưu dữ liệu trắc nghiệm.' });
  } catch (error) { return errorResponse(error); }
}
export async function POST(req: NextRequest) { return save(req, false); }
export async function PUT(req: NextRequest) { return save(req, true); }
export async function DELETE(req: NextRequest) {
  try {
    const type = itemType(req.nextUrl.searchParams.get('type'));
    const id = idValue(req.nextUrl.searchParams.get('id'));
    const row = await existing(type, id);
    if (type === 'result') {
      const references = await execute('SELECT COUNT(*) AS count FROM QuizOptions WHERE ResultType=@key', { key: row.ResultKey });
      if (references.recordset[0].count) throw new InputError('Kết quả đang được dùng trong các lựa chọn. Hãy đổi hoặc xóa các lựa chọn đó trước.', 409);
    }
    if (type === 'industry') {
      const references = await execute('SELECT COUNT(*) AS count FROM QuizResults WHERE IndustryKey=@key', { key: row.IndustryKey });
      if (references.recordset[0].count) throw new InputError('Ngành đang được gán cho kết quả. Hãy bỏ gán ngành trước khi xóa.', 409);
    }
    const statements = type === 'question' ? [{ sql: 'DELETE FROM QuizOptions WHERE QuestionId=@id', params: { id } }] : [];
    statements.push({ sql: `DELETE FROM ${tables[type]} WHERE Id=@id`, params: { id } });
    await executeTransaction(statements);
    return cmsResponse({ message: 'Đã xóa mục trắc nghiệm.' });
  } catch (error) { return errorResponse(error); }
}
