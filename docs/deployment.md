# Deploy qua GitHub Desktop

1. Mở repository TrienLam, chọn main trong GitHub Desktop.
2. Kiểm tra các tệp thay đổi, nhập Summary, bấm Commit to main.
3. Bấm Push origin. Mỗi push lên main sẽ tự chạy Deploy to Production.
4. Xem kết quả tại https://github.com/NguyenMinhPhuc/TrienLam/actions/workflows/deploy.yml.

Commit trên máy chưa kích hoạt deploy. Push nhánh khác main không deploy.
Có thể chạy lại thủ công trong Actions → Deploy to Production → Run workflow → main.
Website không cần GITHUB_PAT, GITHUB_REPO_OWNER hoặc GITHUB_REPO_NAME.

## Cấu hình GitHub một lần

Vào repository → Settings → Secrets and variables → Actions → New repository secret:

- SERVER_HOST: IP hoặc hostname server.
- SERVER_USER: tài khoản SSH có quyền thư mục dự án và PM2.
- SERVER_SSH_KEY: private key đăng nhập server.
- SERVER_PATH: đường dẫn tuyệt đối đến clone dự án trên server.
- SERVER_PORT: tùy chọn, mặc định 22.

Đây là secrets của GitHub Actions, không phải thông tin đăng nhập GitHub Desktop.
Workflow chạy ngay từ push chứa cấu hình này nên cần chuẩn bị server và secrets trước.

## Cấu hình server một lần

Server Linux cần Node.js 22+, npm, Git, PM2 và curl. Clone repository tại SERVER_PATH,
checkout main; working tree phải sạch. Server cần quyền git pull từ GitHub riêng
(ví dụ deploy key đọc repository private); đăng nhập Desktop không cấp quyền cho server.
Reverse proxy trỏ về 127.0.0.1:3127. Cấu hình pm2 startup theo hệ điều hành để tự chạy sau reboot.

Tạo .env riêng trên server từ .env.example, điền cấu hình SQL Server, ADMIN_PASSWORD và Supabase.
.env và public được ignore nên GitHub Desktop không gửi chúng lên GitHub.
Ảnh/video đã nằm trên Supabase; server cần đúng biến SUPABASE_* trước khi build.

Workflow kéo main mới nhất bằng fast-forward, kiểm tra biến môi trường, chạy npm ci,
build, start/reload riêng trien-lam và kiểm tra HTTP tại cổng 3127 trước khi báo thành công.
Các push liên tiếp được GitHub xếp hàng; mỗi lượt lấy main mới nhất tại thời điểm git pull.
Không tự chạy migration DB. Build tại thư mục đang chạy có thể ảnh hưởng website;
chưa có rollback tự động. Nếu lỗi, xem Actions và pm2 logs trien-lam trên server.
