const { execute, query } = require('./db');

async function init() {
  try {
    console.log('Standardizing existing sections...');
    await execute("UPDATE CustomSections SET PageKey = 'home' WHERE PageKey IS NULL OR PageKey = ''", {});
    
    console.log('Checking for academic sections...');
    const academicRes = await execute("SELECT COUNT(*) as count FROM CustomSections WHERE PageKey = 'academic'", {});
    
    if (academicRes.recordset[0].count === 0) {
      console.log('Seeding academic sections...');
      const sections = [
        {
          Title: '1. Tổng quan & Tầm nhìn',
          Subtitle: 'CNTT là gì trong thời đại số?',
          LayoutType: '1-col',
          ContentJson: JSON.stringify([{ title: 'Kiến tạo tương lai bằng công nghệ', body: 'CNTT không chỉ là viết code, mà là công cụ giải quyết các vấn đề toàn cầu như Y tế, Giáo dục, Môi trường. Chúng tôi đào tạo những kỹ sư có tư duy sáng tạo và trách nhiệm xã hội.', icon: 'Globe' }]),
          BgStyle: 'gradient',
          OrderIndex: 10
        },
        {
          Title: '2. Các trụ cột chuyên sâu',
          Subtitle: 'Lựa chọn hướng đi nghề nghiệp đột phá',
          LayoutType: '3-col',
          ContentJson: JSON.stringify([
            { title: 'Phát triển phần mềm', body: 'Xây dựng ứng dụng Web, Mobile và Hệ thống nhúng theo quy trình chuyên nghiệp.', icon: 'Code' },
            { title: 'Trí tuệ nhân tạo (AI) & Dữ liệu', body: 'Machine Learning, Big Data và nghiên cứu Digital Twin tiên phong.', icon: 'Cpu' },
            { title: 'An ninh mạng & Hạ tầng', body: 'Cloud Computing và bảo mật hệ thống thông tin doanh nghiệp.', icon: 'Shield' }
          ]),
          BgStyle: 'default',
          OrderIndex: 20
        },
        {
          Title: '3. Lộ trình phát triển năng lực',
          Subtitle: 'Từ sinh viên đến chuyên gia IT',
          LayoutType: 'timeline',
          ContentJson: JSON.stringify([
            { title: 'Giai đoạn nền tảng', body: 'Tập trung vào tư duy lập trình, cấu trúc dữ liệu và giải thuật căn bản.', icon: 'Zap' },
            { title: 'Giai đoạn thực chiến', body: 'Làm dự án theo team, thực tập tại các doanh nghiệp đối tác hàng đầu.', icon: 'Users' },
            { title: 'Giai đoạn chuyên gia', body: 'Nghiên cứu chuyên sâu, tối ưu hóa hệ thống và dẫn dắt công nghệ.', icon: 'Star' }
          ]),
          BgStyle: 'muted',
          OrderIndex: 30
        },
        {
          Title: '4. Dự án tiêu biểu & Nghiên cứu',
          Subtitle: 'Truyền cảm hứng từ những thành quả thực tế',
          LayoutType: 'product-showcase',
          ContentJson: '[]',
          BgStyle: 'default',
          OrderIndex: 40
        },
        {
          Title: '5. Cơ hội nghề nghiệp & Kết nối',
          Subtitle: 'Cánh cửa mở ra tương lai toàn cầu',
          LayoutType: '3-col',
          ContentJson: JSON.stringify([
            { title: 'Đối tác chiến lược', body: 'Kết nối trực tiếp với tập đoàn công nghệ lớn từ Nhật Bản, Hàn Quốc và Hoa Kỳ.', icon: 'Share2' },
            { title: 'Vị trí công việc', body: 'Software Engineer, Data Scientist, Solutions Architect tại các Big Tech.', icon: 'Briefcase' },
            { title: 'Thu nhập hấp dẫn', body: 'Lương khởi điểm cạnh tranh và thăng tiến nhanh theo lộ trình năng lực.', icon: 'TrendingUp' }
          ]),
          BgStyle: 'gradient',
          OrderIndex: 50
        },
        {
          Title: '6. Môi trường & Trải nghiệm',
          Subtitle: 'Cuộc sống năng động tại Khoa CNTT',
          LayoutType: '2-col',
          ContentJson: JSON.stringify([
            { title: 'Cơ sở vật chất', body: 'Hệ thống Lab nghiên cứu, phòng máy cấu hình cao và không gian sáng tạo hiện đại.', icon: 'Home' },
            { title: 'Hoạt động ngoại khóa', body: 'Code Camp, Hackathon và các CLB Tiếng Anh chuyên ngành sôi nổi.', icon: 'Flame' }
          ]),
          BgStyle: 'default',
          OrderIndex: 60
        }
      ];

      for (const section of sections) {
        await execute(
          `INSERT INTO CustomSections (Title, Subtitle, LayoutType, ContentJson, BgStyle, OrderIndex, IsActive, PageKey) 
           VALUES (@Title, @Subtitle, @LayoutType, @ContentJson, @BgStyle, @OrderIndex, 1, 'academic')`,
          section
        );
      }
      console.log('Seeding completed successfully!');
    } else {
      console.log('Academic sections already exist.');
    }
  } catch (err) {
    console.error('Initialization failed:', err);
  } finally {
    process.exit(0);
  }
}

init();
