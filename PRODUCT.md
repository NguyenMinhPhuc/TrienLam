# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Học sinh và phụ huynh đang tìm hiểu ngành Công nghệ Thông tin tại Đại học Lạc Hồng.
- Sinh viên, giảng viên và khách tham quan muốn khám phá các sản phẩm, hoạt động và định hướng nghề nghiệp của Khoa CNTT.
- Quản trị viên của khoa cập nhật nội dung, sản phẩm, thống kê và câu hỏi trắc nghiệm qua CMS hiện có.

## Product Purpose

LHU Tech Hub là website triển lãm và giới thiệu Khoa Công nghệ Thông tin. Trang giúp khách truy cập hiểu môi trường đào tạo, xem sản phẩm thực tế của sinh viên, khám phá hướng nghề nghiệp phù hợp và kết nối với nhà trường.

## Positioning

Website kết hợp nội dung tuyển sinh với bằng chứng trực tiếp từ các dự án sinh viên và một bài trắc nghiệm hướng nghiệp tương tác, thay vì chỉ trình bày thông tin giới thiệu tĩnh.

## Operating Context

Khách truy cập chủ yếu xem trên trình duyệt máy tính và điện thoại. Nội dung công khai được lấy từ SQL Server; quản trị viên chỉnh sửa qua các trang `/admin`. Trang chủ, trang ngành đào tạo, sản phẩm, quiz và form liên hệ phải tiếp tục dùng dữ liệu CMS hiện có.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind CSS 4, Framer Motion và SQL Server.
- Giữ nguyên các API, cấu trúc dữ liệu CMS, điều hướng, modal sản phẩm, quiz và việc gửi form liên hệ.
- Section động hỗ trợ `1-col`, `2-col`, `3-col`, `4-col`, `timeline`, `product-showcase` và `script-embed`.
- Không tạo thêm số liệu, chứng nhận, đối tác hoặc thành tích chưa có nguồn trong dữ liệu hiện tại.

## Brand Commitments

- Tên sử dụng: LHU Tech Hub, Khoa Công nghệ Thông tin, Đại học Lạc Hồng.
- Giữ nhận diện xanh và cam của LHU; hướng giao diện công khai ưu tiên tone tối.
- Giao diện mới tham chiếu có chọn lọc các mẫu MotionSites đã được duyệt theo từng phân khu, không áp dụng một template cho toàn trang.

## Evidence on Hand

- Nội dung thật từ cơ sở dữ liệu và các trang quản trị hiện có.
- Ảnh khoa, ảnh dự án và tài nguyên upload trong `public/uploads`.
- Bộ prompt, preview và video MotionSites tại `D:/Template UI Web`.
- Chưa có testimonial hoặc số liệu ngoài những gì CMS cung cấp; không được tự tạo thêm.

## Product Principles

- Cho thấy sản phẩm và trải nghiệm học tập thực tế trước khi đưa ra lời kêu gọi tuyển sinh.
- Mỗi phân khu có cá tính chuyển động riêng nhưng cùng một hệ thị giác LHU.
- Nội dung CMS luôn đọc được, kể cả khi ảnh, script hoặc dữ liệu chưa sẵn sàng.
- Chuyển động phục vụ định hướng và phản hồi, không làm chậm thao tác.
- Trải nghiệm desktop và mobile đều phải hoàn chỉnh.

## Accessibility & Inclusion

Hỗ trợ bàn phím, trạng thái focus rõ, tương phản đọc được, nội dung thay thế cho ảnh và `prefers-reduced-motion` cho người dùng cần giảm chuyển động.
