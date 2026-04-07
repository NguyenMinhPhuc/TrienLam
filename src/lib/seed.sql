-- Fix existing rows missing PageKey
UPDATE CustomSections SET PageKey = 'home' WHERE PageKey IS NULL OR PageKey = '';

-- Seed Academic Sections
IF NOT EXISTS (SELECT * FROM CustomSections WHERE PageKey = 'academic')
BEGIN
    INSERT INTO CustomSections (Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive, PageKey)
    VALUES 
    (N'1. Tổng quan & Tầm nhìn', N'CNTT là gì trong thời đại số?', '1-col', '[{"title":"Kiến tạo tương lai bằng công nghệ", "body":"CNTT không chỉ là viết code, mà là công cụ giải quyết các vấn đề toàn cầu như Y tế, Giáo dục, Môi trường. Chúng tôi đào tạo những kỹ sư có tư duy sáng tạo và trách nhiệm xã hội.", "icon":"Globe"}]', 'gradient', 10, 1, 'academic'),
    (N'2. Các trụ cột chuyên sâu', N'Lựa chọn hướng đi nghề nghiệp đột phá', '3-col', '[{"title":"Phát triển phần mềm", "body":"Xây dựng ứng dụng Web, Mobile và Hệ thống nhúng theo quy trình chuyên nghiệp.", "icon":"Code"}, {"title":"Trí tuệ nhân tạo (AI) & Dữ liệu", "body":"Machine Learning, Big Data và nghiên cứu Digital Twin tiên phong.", "icon":"Cpu"}, {"title":"An ninh mạng & Hạ tầng", "body":"Cloud Computing và bảo mật hệ thống thông tin doanh nghiệp.", "icon":"Shield"}]', 'default', 20, 1, 'academic'),
    (N'3. Lộ trình phát triển năng lực', N'Từ sinh viên đến chuyên gia IT', 'timeline', '[{"title":"Giai đoạn nền tảng", "body":"Tập trung vào tư duy lập trình, cấu trúc dữ liệu và giải thuật căn bản.", "icon":"Zap"}, {"title":"Giai đoạn thực chiến", "body":"Làm dự án theo team, thực tập tại các doanh nghiệp đối tác hàng đầu.", "icon":"Users"}, {"title":"Giai đoạn chuyên gia", "body":"Nghiên cứu chuyên sâu, tối ưu hóa hệ thống và dẫn dắt công nghệ.", "icon":"Star"}]', 'muted', 30, 1, 'academic'),
    (N'4. Dự án tiêu biểu & Nghiên cứu', N'Truyền cảm hứng từ những thành quả thực tế', 'product-showcase', '[]', 'default', 40, 1, 'academic'),
    (N'5. Cơ hội nghề nghiệp & Kết nối', N'Cánh cửa mở ra tương lai toàn cầu', '3-col', '[{"title":"Đối tác chiến lược", "body":"Kết nối trực tiếp với tập đoàn công nghệ lớn từ Nhật Bản, Hàn Quốc và Hoa Kỳ.", "icon":"Share2"}, {"title":"Vị trí công việc", "body":"Software Engineer, Data Scientist, Solutions Architect tại các Big Tech.", "icon":"Briefcase"}, {"title":"Thu nhập hấp dẫn", "body":"Lương khởi điểm cạnh tranh và thăng tiến nhanh theo lộ trình năng lực.", "icon":"TrendingUp"}]', 'gradient', 50, 1, 'academic'),
    (N'6. Môi trường & Trải nghiệm', N'Cuộc sống năng động tại Khoa CNTT', '2-col', '[{"title":"Cơ sở vật chất", "body":"Hệ thống Lab nghiên cứu, phòng máy cấu hình cao và không gian sáng tạo hiện đại.", "icon":"Home"}, {"title":"Hoạt động ngoại khóa", "body":"Code Camp, Hackathon và các CLB Tiếng Anh chuyên ngành sôi nổi.", "icon":"Flame"}]', 'default', 60, 1, 'academic');
END
