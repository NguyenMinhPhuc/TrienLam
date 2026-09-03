# LHU Tech Hub CMS

Website triển lãm và trang quản trị nội dung của Khoa Công nghệ Thông tin, xây dựng bằng Next.js 16 và SQL Server.

## Khởi động dự án

Yêu cầu: Node.js 20.9 trở lên, npm và một cơ sở dữ liệu SQL Server đã cấu hình trong `.env`.

```bash
npm install
npm run db:migrate
npm run dev
```

Mở http://localhost:3000 để xem website và http://localhost:3000/admin để vào trang quản trị.

Các biến môi trường cần có:

```dotenv
DB_USER=
DB_PWD=
DB_SERVER=
DB_NAME=
ADMIN_PASSWORD=
```

Với cơ sở dữ liệu mới, chạy [database.sql](./database.sql) trước khi chạy migration. Có thể tạo các section mẫu cho trang ngành đào tạo bằng:

```bash
npm run db:seed-academic
```

## Kiểm tra trước khi triển khai

```bash
npm run lint
npm run typecheck
npm run build
```

Các migration trong `src/lib/migrations` được ghi nhận ở bảng `SchemaMigrations`, nên có thể chạy lại `npm run db:migrate` an toàn.
