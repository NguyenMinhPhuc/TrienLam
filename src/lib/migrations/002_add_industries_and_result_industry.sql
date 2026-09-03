-- Migration: add Industries table and IndustryKey column to QuizResults

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Industries]') AND type in (N'U'))
BEGIN
    CREATE TABLE Industries (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        IndustryKey NVARCHAR(100) NOT NULL UNIQUE,
        Title NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX) NULL
    );
END

-- Add IndustryKey to QuizResults if not exists
IF COL_LENGTH('QuizResults', 'IndustryKey') IS NULL
BEGIN
    ALTER TABLE QuizResults ADD IndustryKey NVARCHAR(100) NULL;
END

-- Seed default industries if table empty
IF NOT EXISTS (SELECT 1 FROM Industries)
BEGIN
    INSERT INTO Industries (IndustryKey, Title, Description) VALUES
    ('AI', N'AI & Data', N'Chuyên gia Trí tuệ nhân tạo và Khoa học dữ liệu'),
    ('Frontend', N'Frontend Development', N'Giao diện người dùng và trải nghiệm người dùng'),
    ('Backend', N'Backend / Systems', N'Hệ thống, server và kiến trúc phần mềm');
END
