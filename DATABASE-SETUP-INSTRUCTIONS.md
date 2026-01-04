# Azure SQL Database Setup Instructions

## Option 1: Automatic Setup (Already Done!)
Your Node.js server automatically creates the database table on startup. The table is already created when you see:
```
✅ Connected to Azure SQL Database
✅ Database tables initialized
```

## Option 2: Manual Setup via Azure Portal

If you prefer to run the SQL scripts manually in Azure:

### Steps:

1. **Navigate to Azure Portal**
   - Go to https://portal.azure.com
   - Sign in to your account

2. **Open SQL Database**
   - Find your SQL Server: `firewarden-sql-watkinson`
   - Select your database: `firewarden_db`

3. **Open Query Editor**
   - Click on "Query editor (preview)" in the left menu
   - Login with:
     - Login: `firewarden_admin`
     - Password: (your password from .env file)

4. **Run the SQL Script**

   **Choose ONE of these options:**

   ### A. Full Setup Script (Recommended)
   Copy and paste the contents of `database-setup.sql` into the query editor and click "Run"

   **This includes:**
   - Table creation with safety checks
   - Performance indexes
   - Sample data (commented out)
   - Verification queries
   - Useful management queries

   ### B. Minimal Setup Script
   Copy and paste the contents of `database-setup-minimal.sql` into the query editor and click "Run"

   **This includes:**
   - Basic table creation
   - Essential indexes only

5. **Verify Setup**
   Run this query to confirm the table was created:
   ```sql
   SELECT * FROM checkins;
   ```

## Database Schema

### Table: `checkins`

| Column         | Type         | Constraints              | Description                    |
|----------------|--------------|--------------------------|--------------------------------|
| id             | INT          | PRIMARY KEY, IDENTITY    | Auto-incrementing ID           |
| staff_number   | VARCHAR(50)  | NOT NULL                 | Employee staff number          |
| first_name     | VARCHAR(100) | NOT NULL                 | Employee first name            |
| last_name      | VARCHAR(100) | NOT NULL                 | Employee last name             |
| location       | VARCHAR(200) | NOT NULL                 | Building/location name         |
| check_in_time  | DATETIME     | DEFAULT GETDATE()        | When they checked in           |
| created_at     | DATETIME     | DEFAULT GETDATE()        | Record creation timestamp      |
| updated_at     | DATETIME     | DEFAULT GETDATE()        | Last update timestamp          |

### Indexes:
- `IX_checkins_staff_number` - Fast lookup by staff number
- `IX_checkins_check_in_time` - Fast sorting by check-in time
- `IX_checkins_location` - Fast filtering by location

## Connection String Format

Your application uses this connection configuration:
```
Server: firewarden-sql-watkinson.database.windows.net
Port: 1433
Database: firewarden_db
User: firewarden_admin@firewarden-sql-watkinson
Password: (stored in server/.env)
Encryption: Enabled (TLS)
```

## Troubleshooting

### Connection Issues:
1. **Firewall Rules**: Ensure your IP address is allowed in Azure SQL Server firewall rules
   - Go to SQL Server → Firewalls and virtual networks
   - Add your client IP address

2. **Password**: Make sure the password in `server/.env` is correct

3. **Database Name**: Verify the database name is exactly `firewarden_db`

### Query Errors:
- If table already exists, that's fine - the scripts handle this
- If you get permission errors, verify you're using the correct admin credentials

## Useful Queries

### View all check-ins:
```sql
SELECT * FROM checkins ORDER BY check_in_time DESC;
```

### Count wardens by location:
```sql
SELECT location, COUNT(*) as warden_count
FROM checkins
GROUP BY location
ORDER BY warden_count DESC;
```

### Today's check-ins:
```sql
SELECT *
FROM checkins
WHERE CAST(check_in_time AS DATE) = CAST(GETDATE() AS DATE)
ORDER BY check_in_time DESC;
```

### Find specific staff member:
```sql
SELECT *
FROM checkins
WHERE staff_number = 'EMP001'
ORDER BY check_in_time DESC;
```

### Delete all records (careful!):
```sql
DELETE FROM checkins;
```

### Drop table (if you need to start fresh):
```sql
DROP TABLE IF EXISTS checkins;
```

## Notes

- The Node.js application automatically handles table creation, so manual setup is optional
- Indexes improve query performance for larger datasets
- The `check_in_time` field automatically records when the check-in was submitted
- `updated_at` is automatically updated when you modify a record via PUT /api/checkins/:id
