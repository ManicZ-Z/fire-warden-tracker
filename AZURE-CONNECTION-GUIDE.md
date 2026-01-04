# Azure SQL Database Connection Configuration

## Your JDBC Connection String (Reference)
```
jdbc:sqlserver://firewarden-sql-watkinson.database.windows.net:1433;
database=firewarden_db;
user=firewarden_admin@firewarden-sql-watkinson;
password={your_password_here};
encrypt=true;
trustServerCertificate=false;
hostNameInCertificate=*.database.windows.net;
loginTimeout=30;
```

## Node.js mssql Package Configuration Mapping

| JDBC Parameter | mssql Config | Value | Description |
|----------------|--------------|-------|-------------|
| `sqlserver://firewarden-sql-watkinson.database.windows.net:1433` | `server` + `port` | `firewarden-sql-watkinson.database.windows.net` + `1433` | Server address and port |
| `database=firewarden_db` | `database` | `firewarden_db` | Database name |
| `user=firewarden_admin@...` | `user` | `firewarden_admin@firewarden-sql-watkinson` | Username (can also use just `firewarden_admin`) |
| `password={your_password}` | `password` | `WillAtkinson!` | Your database password |
| `encrypt=true` | `options.encrypt` | `true` | Encrypts connection with TLS |
| `trustServerCertificate=false` | `options.trustServerCertificate` | `false` | Validates server certificate |
| `hostNameInCertificate=*.database.windows.net` | `options.hostNameInCertificate` | `*.database.windows.net` | Expected certificate hostname |
| `loginTimeout=30` | `connectionTimeout` | `30000` ms | Connection timeout (30 seconds) |

## Current Configuration (server/index.js)

```javascript
const dbConfig = {
  server: process.env.DB_SERVER,                    // firewarden-sql-watkinson.database.windows.net
  port: parseInt(process.env.DB_PORT) || 1433,      // 1433
  database: process.env.DB_DATABASE,                // firewarden_db
  user: process.env.DB_USER,                        // firewarden_admin@firewarden-sql-watkinson
  password: process.env.DB_PASSWORD,                // WillAtkinson!
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: true,                                  // encrypt=true
    trustServerCertificate: false,                  // trustServerCertificate=false
    enableArithAbort: true,
    hostNameInCertificate: '*.database.windows.net' // hostNameInCertificate=*.database.windows.net
  },
  connectionTimeout: 30000,                         // loginTimeout=30
  requestTimeout: 30000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};
```

## Environment Variables (server/.env)

```env
PORT=5000

# Azure SQL Database Configuration
DB_SERVER=firewarden-sql-watkinson.database.windows.net
DB_PORT=1433
DB_DATABASE=firewarden_db
DB_USER=firewarden_admin@firewarden-sql-watkinson
DB_PASSWORD=WillAtkinson!
```

## Alternative User Format

Azure SQL Database accepts two user formats with the mssql package:

### Option 1: With Server Suffix (Current)
```env
DB_USER=firewarden_admin@firewarden-sql-watkinson
```

### Option 2: Without Server Suffix
```env
DB_USER=firewarden_admin
```

Both work! The current configuration uses Option 1, which matches your JDBC string exactly.

## Testing the Connection

### Method 1: Start the server
```bash
cd server
node index.js
```

You should see:
```
✅ SERVER FILE LOADED: ...
✅ Server listening on http://localhost:5000
✅ Connected to Azure SQL Database
✅ Database tables initialized
```

### Method 2: Test script
Create a test file to verify connection:

```javascript
// test-connection.js
require("dotenv").config();
const sql = require("mssql");

const dbConfig = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    hostNameInCertificate: '*.database.windows.net'
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

async function testConnection() {
  try {
    console.log("Attempting to connect to Azure SQL Database...");
    console.log("Server:", dbConfig.server);
    console.log("Database:", dbConfig.database);
    console.log("User:", dbConfig.user);

    const pool = await sql.connect(dbConfig);
    console.log("✅ Successfully connected to Azure SQL Database!");

    const result = await pool.request().query("SELECT DB_NAME() AS DatabaseName");
    console.log("✅ Current Database:", result.recordset[0].DatabaseName);

    await pool.close();
    console.log("✅ Connection closed successfully");
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    console.error("Full error:", err);
  }
}

testConnection();
```

Run it:
```bash
cd server
node test-connection.js
```

## Troubleshooting

### Issue: Connection Timeout
**Error:** `ConnectionError: Failed to connect to ... - getaddrinfo ENOTFOUND`

**Solutions:**
1. Check firewall rules in Azure Portal:
   - Go to SQL Server → Networking/Firewalls and virtual networks
   - Add your client IP address
   - Or enable "Allow Azure services and resources to access this server"

2. Verify server name is correct (no typos)

### Issue: Login Failed
**Error:** `Login failed for user 'firewarden_admin'`

**Solutions:**
1. Verify password in `.env` file is correct
2. Try alternative user format:
   - Change `DB_USER=firewarden_admin` (without @server suffix)
3. Check if user exists in Azure Portal:
   - SQL Server → SQL databases → firewarden_db → Query editor
   - Try logging in manually

### Issue: SSL/TLS Certificate Error
**Error:** Certificate validation error

**Solutions:**
1. Verify `trustServerCertificate` is set to `false` (more secure)
2. Ensure `hostNameInCertificate` is set to `*.database.windows.net`
3. If still issues, temporarily set `trustServerCertificate: true` (less secure, for testing only)

### Issue: Database Not Found
**Error:** `Cannot open database "firewarden_db"`

**Solutions:**
1. Verify database name in Azure Portal
2. Check that database exists and user has access
3. Try connecting to master database first, then switch

## Security Best Practices

1. **Never commit .env file to Git**
   - Already added to .gitignore ✅

2. **Use Azure Key Vault for production**
   - Store connection strings securely
   - Reference via environment variables

3. **Rotate passwords regularly**
   - Change DB_PASSWORD periodically

4. **Use Managed Identity for Azure-hosted apps**
   - Eliminates need for passwords
   - Better security for production

5. **Enable Advanced Threat Protection**
   - Monitor for suspicious database activities
   - Available in Azure SQL Database settings

## Connection String Format for Other Tools

### Azure Data Studio / SQL Server Management Studio (SSMS)
```
Server: firewarden-sql-watkinson.database.windows.net,1433
Database: firewarden_db
Authentication Type: SQL Login
Login: firewarden_admin
Password: WillAtkinson!
Encryption: Mandatory
```

### PowerShell (using SqlServer module)
```powershell
$serverName = "firewarden-sql-watkinson.database.windows.net"
$databaseName = "firewarden_db"
$username = "firewarden_admin"
$password = "WillAtkinson!"

Invoke-Sqlcmd -ServerInstance $serverName -Database $databaseName `
  -Username $username -Password $password -Query "SELECT @@VERSION"
```

### Python (using pyodbc)
```python
import pyodbc

connection_string = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=tcp:firewarden-sql-watkinson.database.windows.net,1433;"
    "Database=firewarden_db;"
    "Uid=firewarden_admin@firewarden-sql-watkinson;"
    "Pwd=WillAtkinson!;"
    "Encrypt=yes;"
    "TrustServerCertificate=no;"
    "Connection Timeout=30;"
)

conn = pyodbc.connect(connection_string)
```

## Performance Tips

1. **Use connection pooling** (already configured ✅)
   - Reuses connections instead of creating new ones
   - Configured with max 10 concurrent connections

2. **Set appropriate timeouts**
   - `connectionTimeout`: 30 seconds (for initial connection)
   - `requestTimeout`: 30 seconds (for query execution)
   - `idleTimeoutMillis`: 30 seconds (before closing idle connections)

3. **Use parameterized queries** (already implemented ✅)
   - Prevents SQL injection
   - Better performance with query plan caching

4. **Monitor DTU/vCore usage**
   - Check Azure Portal metrics
   - Scale up if needed

## Additional Resources

- [mssql npm package documentation](https://www.npmjs.com/package/mssql)
- [Azure SQL Database documentation](https://docs.microsoft.com/en-us/azure/azure-sql/)
- [Connection string syntax](https://docs.microsoft.com/en-us/sql/connect/node-js/node-js-driver-for-sql-server)
