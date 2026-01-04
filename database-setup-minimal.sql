-- ============================================
-- Fire Warden Tracker - MINIMAL Database Setup
-- Azure SQL Database
-- ============================================

-- Create checkins table
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

-- Create indexes for better performance
CREATE INDEX IX_checkins_staff_number ON checkins(staff_number);
CREATE INDEX IX_checkins_check_in_time ON checkins(check_in_time DESC);
CREATE INDEX IX_checkins_location ON checkins(location);

-- Verify table was created
SELECT * FROM checkins;
