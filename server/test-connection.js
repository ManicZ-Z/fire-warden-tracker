require("dotenv").config();
const sql = require("mssql");

// Azure SQL Database configuration matching JDBC connection string
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
  requestTimeout: 30000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

async function testConnection() {
  console.log("=".repeat(60));
  console.log("Azure SQL Database Connection Test");
  console.log("=".repeat(60));
  console.log();

  console.log("📋 Configuration:");
  console.log("   Server:", dbConfig.server);
  console.log("   Port:", dbConfig.port);
  console.log("   Database:", dbConfig.database);
  console.log("   User:", dbConfig.user);
  console.log("   Encrypt:", dbConfig.options.encrypt);
  console.log("   Trust Server Certificate:", dbConfig.options.trustServerCertificate);
  console.log("   Connection Timeout:", dbConfig.connectionTimeout + "ms");
  console.log();

  try {
    console.log("🔄 Attempting to connect to Azure SQL Database...");
    const pool = await sql.connect(dbConfig);
    console.log("✅ Successfully connected to Azure SQL Database!");
    console.log();

    // Test 1: Get database name
    console.log("🔍 Test 1: Verify Database Name");
    const dbNameResult = await pool.request().query("SELECT DB_NAME() AS DatabaseName");
    console.log("   Database:", dbNameResult.recordset[0].DatabaseName);
    console.log("   ✅ PASSED");
    console.log();

    // Test 2: Get SQL Server version
    console.log("🔍 Test 2: Get SQL Server Version");
    const versionResult = await pool.request().query("SELECT @@VERSION AS Version");
    console.log("   Version:", versionResult.recordset[0].Version.split('\n')[0]);
    console.log("   ✅ PASSED");
    console.log();

    // Test 3: Check if checkins table exists
    console.log("🔍 Test 3: Check if 'checkins' table exists");
    const tableCheckResult = await pool.request().query(`
      SELECT COUNT(*) AS TableExists
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_NAME = 'checkins'
    `);
    const tableExists = tableCheckResult.recordset[0].TableExists > 0;
    console.log("   Table exists:", tableExists ? "Yes" : "No");
    if (tableExists) {
      console.log("   ✅ PASSED");
    } else {
      console.log("   ⚠️  WARNING: Table does not exist yet. Run the server to create it.");
    }
    console.log();

    // Test 4: If table exists, count records
    if (tableExists) {
      console.log("🔍 Test 4: Count records in checkins table");
      const countResult = await pool.request().query("SELECT COUNT(*) AS RecordCount FROM checkins");
      console.log("   Total records:", countResult.recordset[0].RecordCount);
      console.log("   ✅ PASSED");
      console.log();
    }

    // Test 5: Get table schema
    if (tableExists) {
      console.log("🔍 Test 5: Display checkins table schema");
      const schemaResult = await pool.request().query(`
        SELECT
          COLUMN_NAME,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH,
          IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'checkins'
        ORDER BY ORDINAL_POSITION
      `);
      console.log("   Columns:");
      schemaResult.recordset.forEach(col => {
        const length = col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : '';
        const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
        console.log(`      - ${col.COLUMN_NAME}: ${col.DATA_TYPE}${length} ${nullable}`);
      });
      console.log("   ✅ PASSED");
      console.log();
    }

    // Close connection
    await pool.close();
    console.log("✅ Connection closed successfully");
    console.log();
    console.log("=".repeat(60));
    console.log("🎉 All tests completed successfully!");
    console.log("=".repeat(60));

  } catch (err) {
    console.error();
    console.error("❌ Connection test failed!");
    console.error("=".repeat(60));
    console.error("Error:", err.message);
    console.error();
    console.error("📋 Troubleshooting Tips:");

    if (err.message.includes("getaddrinfo") || err.message.includes("ENOTFOUND")) {
      console.error("   • Check your internet connection");
      console.error("   • Verify the server name is correct in .env file");
      console.error("   • Check Azure SQL Server firewall rules");
    } else if (err.message.includes("Login failed")) {
      console.error("   • Verify DB_USER in .env file");
      console.error("   • Verify DB_PASSWORD in .env file");
      console.error("   • Try alternative user format (with or without @server)");
    } else if (err.message.includes("Cannot open database")) {
      console.error("   • Verify database name is 'firewarden_db'");
      console.error("   • Check that database exists in Azure Portal");
    } else if (err.message.includes("certificate") || err.message.includes("SSL")) {
      console.error("   • TLS/SSL certificate validation failed");
      console.error("   • Verify hostNameInCertificate setting");
    }

    console.error();
    console.error("Full error details:");
    console.error(err);
    console.error("=".repeat(60));
    process.exit(1);
  }
}

// Run the test
testConnection();
