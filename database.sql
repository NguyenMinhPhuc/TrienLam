-- Base schema for LHU Tech Hub CMS (SQL Server).
-- After creating these tables, run `npm run db:migrate` and optionally
-- `npm run db:seed-academic` from the application directory.

IF OBJECT_ID(N'dbo.SiteContent', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.SiteContent (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        SectionKey NVARCHAR(100) NOT NULL UNIQUE,
        Content NVARCHAR(MAX) NOT NULL,
        LastUpdated DATETIME NULL DEFAULT GETDATE()
    );
END;

IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Products (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Name NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        ImageUrl NVARCHAR(500) NULL,
        AppUrl NVARCHAR(500) NULL,
        TechTags NVARCHAR(255) NULL,
        CareerPath NVARCHAR(100) NULL,
        [Year] INT NULL DEFAULT 2026,
        CreatedAt DATETIME NULL DEFAULT GETDATE(),
        Author NVARCHAR(MAX) NULL
    );
END;

IF OBJECT_ID(N'dbo.QuizQuestions', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.QuizQuestions (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        QuestionText NVARCHAR(MAX) NOT NULL,
        OrderIndex INT NULL DEFAULT 0
    );
END;

IF OBJECT_ID(N'dbo.QuizOptions', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.QuizOptions (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        QuestionId INT NULL,
        OptionText NVARCHAR(MAX) NOT NULL,
        ResultType NVARCHAR(50) NULL,
        OrderIndex INT NULL DEFAULT 0,
        CONSTRAINT FK_QuizOptions_QuizQuestions
            FOREIGN KEY (QuestionId) REFERENCES dbo.QuizQuestions(Id) ON DELETE CASCADE
    );
END;

IF OBJECT_ID(N'dbo.QuizResults', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.QuizResults (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ResultKey NVARCHAR(50) NOT NULL UNIQUE,
        Title NVARCHAR(MAX) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        IconName NVARCHAR(50) NULL
    );
END;

IF OBJECT_ID(N'dbo.Stats', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Stats (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Label NVARCHAR(MAX) NOT NULL,
        Value NVARCHAR(MAX) NOT NULL,
        IconName NVARCHAR(50) NULL,
        OrderIndex INT NULL DEFAULT 0
    );
END;

IF OBJECT_ID(N'dbo.ContactSubmissions', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ContactSubmissions (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        FullName NVARCHAR(255) NOT NULL,
        Email NVARCHAR(255) NOT NULL,
        Message NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME NULL DEFAULT GETDATE(),
        Status NVARCHAR(50) NULL DEFAULT 'unread',
        Phone NVARCHAR(20) NULL
    );
END;

IF OBJECT_ID(N'dbo.CustomSections', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CustomSections (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Title NVARCHAR(MAX) NOT NULL,
        Subtitle NVARCHAR(MAX) NULL,
        LayoutType NVARCHAR(50) NULL DEFAULT '1-col',
        ContentJson NVARCHAR(MAX) NULL,
        BgStyle NVARCHAR(50) NULL DEFAULT 'default',
        OrderIndex INT NULL DEFAULT 0,
        IsActive BIT NULL DEFAULT 1,
        CreatedAt DATETIME NULL DEFAULT GETDATE(),
        PageKey NVARCHAR(50) NULL DEFAULT 'home'
    );
END;
