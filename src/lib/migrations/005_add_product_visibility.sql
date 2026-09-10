-- Add a persistent visibility switch for products managed from the admin area.

IF COL_LENGTH('dbo.Products', 'IsVisible') IS NULL
BEGIN
    ALTER TABLE dbo.Products
      ADD IsVisible BIT NOT NULL
        CONSTRAINT DF_Products_IsVisible DEFAULT (1) WITH VALUES;
END;
