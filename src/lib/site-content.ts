export type SiteContentFieldType = 'text' | 'textarea' | 'html' | 'url' | 'image';

export interface SiteContentFieldDefinition {
  key: keyof typeof SITE_CONTENT_DEFAULTS;
  label: string;
  description?: string;
  type: SiteContentFieldType;
  rows?: number;
}

export interface SiteContentGroupDefinition {
  id: string;
  title: string;
  description: string;
  fields: SiteContentFieldDefinition[];
}

/**
 * The values here intentionally mirror the current public website. A missing
 * database row therefore never changes the existing appearance or copy.
 */
export const SITE_CONTENT_DEFAULTS = {
  nav_faculty_label: 'Khoa CNTT',
  nav_faculty_url: '/#faculty',
  nav_academic_label: 'Ngành đào tạo',
  nav_academic_url: '/academic',
  nav_products_label: 'Sản phẩm',
  nav_products_url: '/#products',
  nav_quiz_label: 'Hướng nghiệp',
  nav_quiz_url: '/#quiz',
  nav_admissions_label: 'Tuyển sinh 2026',
  nav_admissions_url: 'https://tuyensinh.lhu.edu.vn',

  hero_title: 'Nơi Khởi Đầu <br/><span class="gradient-text">Đam Mê Công Nghệ</span>',
  hero_subtitle: 'Trải nghiệm hệ sinh thái AI độc quyền từ Đại học Lạc Hồng. Khám phá lộ trình nghề nghiệp IT tương lai.',
  hero_products_label: 'Khám phá sản phẩm',
  hero_products_url: '#products',
  hero_quiz_label: 'Bắt đầu trắc nghiệm',
  hero_quiz_url: '#quiz',
  hero_scroll_label: 'Cuộn để khám phá',
  hero_scroll_url: '#stats',
  hero_video_src: '/media/codenest-lhu.mp4',
  hero_poster_src: '/media/lhu-hero-poster.svg',

  stats_title: 'Những con số kể câu chuyện học tập.',
  stats_description: 'Mỗi kết quả được cập nhật từ hệ thống quản trị, phản ánh quy mô đào tạo và hoạt động thực tế của Khoa Công nghệ Thông tin.',

  faculty_title: 'Học công nghệ bằng cách tạo ra những điều có ích.',
  about_faculty: 'Khoa Công nghệ Thông tin tập trung vào kỹ năng thực chiến, tư duy sáng tạo và khả năng giải quyết những bài toán thực tế bằng công nghệ.',
  about_faculty_image: '/uploads/Faculty.jpg',
  faculty_image_alt: 'Khoa Công nghệ Thông tin, Đại học Lạc Hồng',
  faculty_cta_label: 'Xem trang Khoa CNTT',
  faculty_cta_url: 'https://cs.lhu.edu.vn',
  faculty_feature_one: 'Học qua dự án thực tế',
  faculty_feature_two: 'Kết nối cùng cộng đồng',
  faculty_media_caption: 'Khoa Công nghệ Thông tin · Đại học Lạc Hồng',
  faculty_media_location: 'Biên Hòa, Đồng Nai',

  products_title: 'Sản phẩm công nghệ nổi bật',
  products_description: 'Khám phá các dự án thực tế được phát triển bởi sinh viên Khoa Công nghệ Thông tin.',

  quiz_title: 'Tìm hướng đi phù hợp với bạn.',
  quiz_description: 'Một chuỗi câu hỏi ngắn giúp bạn nhận diện lĩnh vực công nghệ nên khám phá tiếp theo.',
  quiz_start_title: 'Bạn thuộc “team” nào trong ngành IT?',
  quiz_start_description: 'Hoàn thành {count} câu hỏi. Không có đáp án đúng hay sai—hãy chọn điều giống bạn nhất.',
  quiz_start_button: 'Bắt đầu ngay',
  quiz_step_one: 'Đọc tình huống',
  quiz_step_two: 'Chọn phản ứng',
  quiz_step_three: 'Nhận gợi ý nghề nghiệp',

  contact_title: 'Hãy bắt đầu một cuộc trò chuyện.',
  contact_description: 'Kết nối với Khoa Công nghệ Thông tin để tìm hiểu chương trình học, hoạt động nghiên cứu và cơ hội trải nghiệm thực tế.',
  contact_address: 'Đang cập nhật...',
  contact_phone: 'Đang cập nhật...',
  contact_email: 'Đang cập nhật...',

  mission_title: 'Sứ mệnh & tầm nhìn',
  it_industry_info: 'Đại học Lạc Hồng cam kết đào tạo những kỹ sư không chỉ giỏi về kỹ năng mà còn có tư duy giải quyết vấn đề thực tiễn, đóng góp cho sự phát triển của nền kinh tế số Việt Nam.',
  mission_cta_label: 'Khám phá thông tin tuyển sinh',
  mission_cta_url: 'https://tuyensinh.lhu.edu.vn',

  footer_title: 'ĐẠI HỌC LẠC HỒNG',
  footer_address: 'Số 10, Huỳnh Văn Nghệ, P. Bửu Long, TP. Biên Hòa, Đồng Nai.',
  footer_copy: '© 2026 LHU Tech Hub. All rights reserved.',
  footer_layout: '3-col',
  footer_show_map: '0',
  footer_map_embed: '',
  footer_social_facebook: '',
  footer_social_zalo: '',
  footer_social_instagram: '',
  footer_social_youtube: '',
  footer_social_linkedin: '',
  footer_social_tiktok: '',
  footer_nav_faculty_label: 'Khoa CNTT',
  footer_nav_faculty_url: '/#faculty',
  footer_nav_academic_label: 'Ngành đào tạo',
  footer_nav_academic_url: '/academic',
  footer_nav_products_label: 'Sản phẩm sinh viên',
  footer_nav_products_url: '/#products',
  footer_nav_quiz_label: 'Trắc nghiệm nghề nghiệp',
  footer_nav_quiz_url: '/#quiz',
  footer_follow_title: 'Theo dõi LHU',
  footer_social_empty: 'Các kênh truyền thông đang được cập nhật.',
  footer_back_to_top_label: 'Trở lại đầu trang',
} as const;

export type SiteContentKey = keyof typeof SITE_CONTENT_DEFAULTS;

export const SITE_CONTENT_GROUPS: SiteContentGroupDefinition[] = [
  {
    id: 'navigation',
    title: 'Thanh điều hướng',
    description: 'Tên và đường dẫn của các mục trên thanh menu ở đầu trang.',
    fields: [
      { key: 'nav_faculty_label', label: 'Tên mục Khoa CNTT', type: 'text' },
      { key: 'nav_faculty_url', label: 'Đường dẫn Khoa CNTT', type: 'url' },
      { key: 'nav_academic_label', label: 'Tên mục Ngành đào tạo', type: 'text' },
      { key: 'nav_academic_url', label: 'Đường dẫn Ngành đào tạo', type: 'url' },
      { key: 'nav_products_label', label: 'Tên mục Sản phẩm', type: 'text' },
      { key: 'nav_products_url', label: 'Đường dẫn Sản phẩm', type: 'url' },
      { key: 'nav_quiz_label', label: 'Tên mục Hướng nghiệp', type: 'text' },
      { key: 'nav_quiz_url', label: 'Đường dẫn Hướng nghiệp', type: 'url' },
      { key: 'nav_admissions_label', label: 'Nhãn nút tuyển sinh', type: 'text' },
      { key: 'nav_admissions_url', label: 'Đường dẫn nút tuyển sinh', type: 'url' },
    ],
  },
  {
    id: 'hero',
    title: 'Mở đầu trang chủ',
    description: 'Tiêu đề, hai nút hành động và nội dung nền của khu vực đầu trang.',
    fields: [
      { key: 'hero_title', label: 'Tiêu đề Hero', description: 'Hỗ trợ HTML cơ bản.', type: 'html', rows: 3 },
      { key: 'hero_subtitle', label: 'Phụ đề Hero', description: 'Hỗ trợ HTML cơ bản.', type: 'html', rows: 4 },
      { key: 'hero_products_label', label: 'Nhãn nút sản phẩm', type: 'text' },
      { key: 'hero_products_url', label: 'Đường dẫn nút sản phẩm', type: 'url' },
      { key: 'hero_quiz_label', label: 'Nhãn nút trắc nghiệm', type: 'text' },
      { key: 'hero_quiz_url', label: 'Đường dẫn nút trắc nghiệm', type: 'url' },
      { key: 'hero_scroll_label', label: 'Nhãn cuộn xuống', type: 'text' },
      { key: 'hero_scroll_url', label: 'Đường dẫn cuộn xuống', type: 'url' },
      { key: 'hero_video_src', label: 'Đường dẫn video nền', description: 'Nhập đường dẫn trong /public hoặc URL video.', type: 'url' },
      { key: 'hero_poster_src', label: 'Ảnh chờ của video', type: 'image' },
    ],
  },
  {
    id: 'stats',
    title: 'Phần số liệu',
    description: 'Tiêu đề và lời dẫn. Các con số được quản lý riêng tại mục Thống kê.',
    fields: [
      { key: 'stats_title', label: 'Tiêu đề phần số liệu', type: 'text' },
      { key: 'stats_description', label: 'Mô tả phần số liệu', type: 'textarea', rows: 4 },
    ],
  },
  {
    id: 'faculty',
    title: 'Giới thiệu Khoa CNTT',
    description: 'Toàn bộ nội dung, ảnh, chú thích và liên kết trong phần giới thiệu khoa.',
    fields: [
      { key: 'faculty_title', label: 'Tiêu đề phần giới thiệu', type: 'text' },
      { key: 'about_faculty', label: 'Nội dung giới thiệu', description: 'Hỗ trợ HTML cơ bản.', type: 'html', rows: 7 },
      { key: 'about_faculty_image', label: 'Ảnh giới thiệu khoa', type: 'image' },
      { key: 'faculty_image_alt', label: 'Mô tả ảnh cho trình đọc màn hình', type: 'text' },
      { key: 'faculty_cta_label', label: 'Nhãn liên kết Khoa CNTT', type: 'text' },
      { key: 'faculty_cta_url', label: 'Đường dẫn Khoa CNTT', type: 'url' },
      { key: 'faculty_feature_one', label: 'Điểm nổi bật thứ nhất', type: 'text' },
      { key: 'faculty_feature_two', label: 'Điểm nổi bật thứ hai', type: 'text' },
      { key: 'faculty_media_caption', label: 'Chú thích trên ảnh', type: 'text' },
      { key: 'faculty_media_location', label: 'Địa điểm trên ảnh', type: 'text' },
    ],
  },
  {
    id: 'products',
    title: 'Khu vực sản phẩm',
    description: 'Tiêu đề và lời dẫn của danh sách sản phẩm. Dự án và ảnh dự án được quản lý tại mục Sản phẩm.',
    fields: [
      { key: 'products_title', label: 'Tiêu đề khu vực sản phẩm', type: 'text' },
      { key: 'products_description', label: 'Mô tả khu vực sản phẩm', type: 'textarea', rows: 4 },
    ],
  },
  {
    id: 'quiz',
    title: 'Khu vực hướng nghiệp',
    description: 'Lời giới thiệu và màn hình bắt đầu. Câu hỏi, đáp án và kết quả nằm tại mục Trắc nghiệm.',
    fields: [
      { key: 'quiz_title', label: 'Tiêu đề phần hướng nghiệp', type: 'text' },
      { key: 'quiz_description', label: 'Mô tả phần hướng nghiệp', type: 'textarea', rows: 4 },
      { key: 'quiz_start_title', label: 'Tiêu đề màn hình bắt đầu', type: 'text' },
      { key: 'quiz_start_description', label: 'Mô tả màn hình bắt đầu', description: 'Dùng {count} để hiển thị số câu hỏi.', type: 'textarea', rows: 3 },
      { key: 'quiz_start_button', label: 'Nhãn nút bắt đầu', type: 'text' },
      { key: 'quiz_step_one', label: 'Bước 1', type: 'text' },
      { key: 'quiz_step_two', label: 'Bước 2', type: 'text' },
      { key: 'quiz_step_three', label: 'Bước 3', type: 'text' },
    ],
  },
  {
    id: 'contact',
    title: 'Liên hệ',
    description: 'Tiêu đề, lời dẫn và thông tin liên hệ xuất hiện bên cạnh biểu mẫu.',
    fields: [
      { key: 'contact_title', label: 'Tiêu đề phần liên hệ', type: 'text' },
      { key: 'contact_description', label: 'Mô tả phần liên hệ', type: 'textarea', rows: 4 },
      { key: 'contact_address', label: 'Địa chỉ', type: 'textarea', rows: 3 },
      { key: 'contact_phone', label: 'Số điện thoại / Hotline', type: 'text' },
      { key: 'contact_email', label: 'Email chính thức', type: 'text' },
    ],
  },
  {
    id: 'mission',
    title: 'Sứ mệnh & tầm nhìn',
    description: 'Tên phân khu, nội dung trích dẫn và liên kết tuyển sinh.',
    fields: [
      { key: 'mission_title', label: 'Tiêu đề phân khu', type: 'text' },
      { key: 'it_industry_info', label: 'Nội dung sứ mệnh & tầm nhìn', type: 'textarea', rows: 8 },
      { key: 'mission_cta_label', label: 'Nhãn liên kết tuyển sinh', type: 'text' },
      { key: 'mission_cta_url', label: 'Đường dẫn tuyển sinh', type: 'url' },
    ],
  },
  {
    id: 'footer',
    title: 'Chân trang',
    description: 'Thông tin trường, bản quyền, bản đồ và các kênh mạng xã hội.',
    fields: [
      { key: 'footer_title', label: 'Tiêu đề chân trang', type: 'text' },
      { key: 'footer_address', label: 'Địa chỉ chân trang', type: 'textarea', rows: 3 },
      { key: 'footer_copy', label: 'Dòng bản quyền', type: 'text' },
      { key: 'footer_map_embed', label: 'Mã nhúng bản đồ (iframe)', type: 'textarea', rows: 4 },
      { key: 'footer_social_facebook', label: 'Liên kết Facebook', type: 'url' },
      { key: 'footer_social_zalo', label: 'Liên kết Zalo', type: 'url' },
      { key: 'footer_social_instagram', label: 'Liên kết Instagram', type: 'url' },
      { key: 'footer_social_youtube', label: 'Liên kết YouTube', type: 'url' },
      { key: 'footer_social_linkedin', label: 'Liên kết LinkedIn', type: 'url' },
      { key: 'footer_social_tiktok', label: 'Liên kết TikTok', type: 'url' },
      { key: 'footer_nav_faculty_label', label: 'Nhãn liên kết Khoa CNTT', type: 'text' },
      { key: 'footer_nav_faculty_url', label: 'Đường dẫn Khoa CNTT', type: 'url' },
      { key: 'footer_nav_academic_label', label: 'Nhãn liên kết Ngành đào tạo', type: 'text' },
      { key: 'footer_nav_academic_url', label: 'Đường dẫn Ngành đào tạo', type: 'url' },
      { key: 'footer_nav_products_label', label: 'Nhãn liên kết Sản phẩm', type: 'text' },
      { key: 'footer_nav_products_url', label: 'Đường dẫn Sản phẩm', type: 'url' },
      { key: 'footer_nav_quiz_label', label: 'Nhãn liên kết Trắc nghiệm', type: 'text' },
      { key: 'footer_nav_quiz_url', label: 'Đường dẫn Trắc nghiệm', type: 'url' },
      { key: 'footer_follow_title', label: 'Tiêu đề mạng xã hội', type: 'text' },
      { key: 'footer_social_empty', label: 'Thông báo khi chưa có mạng xã hội', type: 'text' },
      { key: 'footer_back_to_top_label', label: 'Nhãn trở lại đầu trang', type: 'text' },
    ],
  },
];

export function contentValue(content: Record<string, string>, key: SiteContentKey): string {
  return content[key] || SITE_CONTENT_DEFAULTS[key];
}
