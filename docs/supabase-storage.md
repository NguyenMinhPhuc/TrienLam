# Supabase Storage cho ảnh và video CMS

Ứng dụng dùng project `https://kglzkrrvvcwsaothebpe.supabase.co` và bucket công khai `site-media`. Quyền ghi chỉ nằm trong API admin phía server; trình duyệt chỉ nhận URL công khai của tệp.

## Hoàn tất khóa bí mật

Mở **Supabase Dashboard → Project Settings → API Keys**, tạo hoặc sao chép khóa dạng `sb_secret_...`, rồi điền trực tiếp trên máy vào:

```dotenv
SUPABASE_SECRET_KEY=sb_secret_...
```

Không gửi khóa qua chat, không thêm tiền tố `NEXT_PUBLIC_` và không commit `.env`.

## Tạo và kiểm tra bucket

```powershell
npm run storage:check
```

Lệnh này tạo bucket `site-media` nếu chưa có, đặt bucket công khai, giới hạn 50 MB/tệp và chỉ cho phép định dạng ảnh/video mà CMS hỗ trợ.

## Chuyển media hiện tại

Kiểm tra trước danh sách:

```powershell
npm run storage:migrate:dry
```

Sau khi đã điền secret key, tải toàn bộ nội dung local trong `public` lên Supabase:

```powershell
npm run storage:migrate
```

Cấu trúc đường dẫn được giữ nguyên. Ví dụ `public/uploads/Faculty.jpg` trở thành `uploads/Faculty.jpg`. Khi chạy local, Next.js ưu tiên file còn có trong `public`; khi deploy không kèm `public`, các URL cũ tự động chuyển qua Supabase Storage.

## Biến môi trường trên server

Khai báo các biến sau trong môi trường deploy:

```dotenv
SUPABASE_URL=https://kglzkrrvvcwsaothebpe.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
SUPABASE_STORAGE_BUCKET=site-media
SUPABASE_STORAGE_MAX_MB=50
```

Sau khi đổi biến môi trường, build và khởi động lại ứng dụng. Ảnh/video tải mới từ trang admin sẽ được lưu trực tiếp trên Supabase và CMS lưu URL CDN công khai.
