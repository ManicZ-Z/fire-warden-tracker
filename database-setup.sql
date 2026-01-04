-- ============================================
-- Fire Warden Tracker Database Setup Script
-- Azure SQL Database
-- ============================================

-- Drop existing table if you want a fresh start (uncomment if needed)
-- DROP TABLE IF EXISTS checkins;

-- ============================================
-- Create checkins table
-- ============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='checkins' AND xtype='U')
BEGIN
    CREATE TABLE checkins (
        id INT PRIMARY KEY IDENTITY(1,1),
        staff_number VARCHAR(50) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        location VARCHAR(200) NOT NULL,
        check_in_time DATETIME DEFAULT GETDATE(),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );

    PRINT 'Table "checkins" created successfully.';
END
ELSE
BEGIN
    PRINT 'Table "checkins" already exists.';
END
GO

-- ============================================
-- Create indexes for better query performance
-- ============================================

-- Index on staff_number for faster lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_checkins_staff_number' AND object_id = OBJECT_ID('checkins'))
BEGIN
    CREATE INDEX IX_checkins_staff_number ON checkins(staff_number);
    PRINT 'Index "IX_checkins_staff_number" created successfully.';
END
GO

-- Index on check_in_time for faster date-based queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_checkins_check_in_time' AND object_id = OBJECT_ID('checkins'))
BEGIN
    CREATE INDEX IX_checkins_check_in_time ON checkins(check_in_time DESC);
    PRINT 'Index "IX_checkins_check_in_time" created successfully.';
END
GO

-- Index on location for faster location-based filtering
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_checkins_location' AND object_id = OBJECT_ID('checkins'))
BEGIN
    CREATE INDEX IX_checkins_location ON checkins(location);
    PRINT 'Index "IX_checkins_location" created successfully.';
END
GO

-- ============================================
-- Insert sample test data (optional - uncomment to use)
-- ============================================

/*
INSERT INTO checkins (staff_number, first_name, last_name, location, check_in_time)
VALUES
    ('EMP001', 'John', 'Smith', 'Martial Rose Library', GETDATE()),
    ('EMP002', 'Sarah', 'Johnson', 'King Alfred Centre', DATEADD(MINUTE, -30, GETDATE())),
    ('EMP003', 'Michael', 'Williams', 'West Downs Centre', DATEADD(HOUR, -1, GETDATE())),
    ('EMP004', 'Emma', 'Brown', 'Business School', DATEADD(HOUR, -2, GETDATE())),
    ('EMP005', 'David', 'Jones', 'Fred Wheeler Building', DATEADD(HOUR, -3, GETDATE()));

PRINT 'Sample data inserted successfully.';
*/

-- ============================================
-- Verify table creation and view structure
-- ============================================
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'checkins'
ORDER BY ORDINAL_POSITION;
GO

-- ============================================
-- View all check-ins (useful for testing)
-- ============================================
SELECT
    id,
    staff_number,
    first_name,
    last_name,
    location,
    check_in_time,
    created_at,
    updated_at
FROM checkins
ORDER BY check_in_time DESC;
GO

-- ============================================
-- Additional useful queries for management
-- ============================================

-- Count check-ins by location
-- SELECT location, COUNT(*) as warden_count
-- FROM checkins
-- GROUP BY location
-- ORDER BY warden_count DESC;

-- Get today's check-ins
-- SELECT *
-- FROM checkins
-- WHERE CAST(check_in_time AS DATE) = CAST(GETDATE() AS DATE)
-- ORDER BY check_in_time DESC;

-- Find specific staff member's check-ins
-- SELECT *
-- FROM checkins
-- WHERE staff_number = 'EMP001'
-- ORDER BY check_in_time DESC;

PRINT 'Database setup completed successfully!';
GO
