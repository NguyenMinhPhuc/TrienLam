import { NextRequest, NextResponse } from 'next/server';
import { execute } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { FullName, Email, Phone, Message } = body;

    if (!FullName || !Email || !Message) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ các trường bắt buộc.' }, { status: 400 });
    }

    await execute(
      `INSERT INTO ContactSubmissions (FullName, Email, Phone, Message) 
       VALUES (@FullName, @Email, @Phone, @Message)`,
      { FullName, Email, Phone, Message }
    );

    return NextResponse.json({ message: 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.' });
  } catch (err) {
    console.error('Contact Submission Error:', err);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.' }, { status: 500 });
  }
}
