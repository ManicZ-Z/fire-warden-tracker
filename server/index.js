require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

console.log("✅ SERVER FILE LOADED:", __filename);

const app = express();

// Azure SQL Database configuration
// Maps to JDBC: jdbc:sqlserver://firewarden-sql-watkinson.database.windows.net:1433;
// database=firewarden_db;user=firewarden_admin@firewarden-sql-watkinson;
// password={your_password};encrypt=true;trustServerCertificate=false;
// hostNameInCertificate=*.database.windows.net;loginTimeout=30;
const dbConfig = {
  server: process.env.DB_SERVER,                    // firewarden-sql-watkinson.database.windows.net
  port: parseInt(process.env.DB_PORT) || 1433,      // 1433
  database: process.env.DB_DATABASE,                // firewarden_db
  user: process.env.DB_USER,                        // firewarden_admin@firewarden-sql-watkinson (or just firewarden_admin)
  password: process.env.DB_PASSWORD,                // your password
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: true,                                  // encrypt=true
    trustServerCertificate: false,                  // trustServerCertificate=false
    enableArithAbort: true,
    hostNameInCertificate: '*.database.windows.net' // hostNameInCertificate=*.database.windows.net
  },
  connectionTimeout: 30000,                         // loginTimeout=30 (in milliseconds)
  requestTimeout: 30000,                            // request timeout
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Database connection pool
let poolPromise;

async function connectToDatabase() {
  try {
    poolPromise = sql.connect(dbConfig);
    await poolPromise;
    console.log("✅ Connected to Azure SQL Database");

    // Initialize database tables
    await initializeTables();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("Make sure to update the DB_PASSWORD in server/.env file");
  }
}

async function initializeTables() {
  try {
    const pool = await poolPromise;

    // Create checkins table if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='checkins' AND xtype='U')
      CREATE TABLE checkins (
        id INT PRIMARY KEY IDENTITY(1,1),
        staff_number VARCHAR(50) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        location VARCHAR(200) NOT NULL,
        check_in_time DATETIME DEFAULT GETDATE(),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create users table if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (
        id INT PRIMARY KEY IDENTITY(1,1),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    console.log("✅ Database tables initialized");
  } catch (err) {
    console.error("❌ Failed to initialize tables:", err.message);
  }
}

// Connect to database on startup
connectToDatabase();

const LOCATIONS = [
  "Alwyn Hall",
  "Beech Glade",
  "Bowers Building",
  "Burma Road Student Village",
  "Centre for Sport",
  "Chapel",
  "The Cottage",
  "Fred Wheeler Building",
  "Herbert Jarman Building",
  "Holm Lodge",
  "Kenneth Kettle Building",
  "King Alfred Centre",
  "Martial Rose Library",
  "Masters Lodge",
  "Medecroft",
  "Medecroft Annexe",
  "Paul Chamberlain Building",
  "Queen's Road Student Village",
  "St Alphege",
  "St Edburga",
  "St Elizabeth's Hall",
  "St Grimbald's Court",
  "St James' Hall",
  "St Swithun's Lodge",
  "The Stripe",
  "Business School",
  "Tom Atkinson Building",
  "West Downs Centre",
  "West Downs Student Village",
  "Winton Building",
  "Students' Union"
];

app.use(cors());
app.use(express.json());

// Log every request so we KNOW the server is alive
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running ✅" });
});

// Get all locations (protected)
app.get("/api/locations", authenticateToken, (req, res) => {
  res.json(LOCATIONS);
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// Register new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = "user" } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const pool = await poolPromise;
    const existingUser = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT id FROM users WHERE email = @email");

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .input("passwordHash", sql.VarChar, passwordHash)
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input("role", sql.VarChar, role)
      .query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.first_name, INSERTED.last_name, INSERTED.role
        VALUES (@email, @passwordHash, @firstName, @lastName, @role)
      `);

    const user = result.recordset[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Failed to register user", message: err.message });
  }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const pool = await poolPromise;
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.recordset[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Failed to login", message: err.message });
  }
});

// ==================== END AUTHENTICATION ENDPOINTS ====================

// ==================== JWT AUTHENTICATION MIDDLEWARE ====================

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request object
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

// ==================== END MIDDLEWARE ====================

// Get all check-ins (for dashboard) - protected
app.get("/api/checkins", authenticateToken, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT id, staff_number, first_name, last_name, location, check_in_time, created_at, updated_at
      FROM checkins
      ORDER BY check_in_time DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching check-ins:", err);
    res.status(500).json({ error: "Failed to fetch check-ins", message: err.message });
  }
});

// Create a new check-in - protected
app.post("/api/checkins", authenticateToken, async (req, res) => {
  try {
    const { staffNumber, firstName, lastName, location } = req.body;

    // Validate input
    if (!staffNumber || !firstName || !lastName || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input("staffNumber", sql.VarChar, staffNumber)
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input("location", sql.VarChar, location)
      .query(`
        INSERT INTO checkins (staff_number, first_name, last_name, location)
        OUTPUT INSERTED.*
        VALUES (@staffNumber, @firstName, @lastName, @location)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error creating check-in:", err);
    res.status(500).json({ error: "Failed to create check-in", message: err.message });
  }
});

// Update a check-in - protected
app.put("/api/checkins/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { staffNumber, firstName, lastName, location } = req.body;

    // Validate input
    if (!staffNumber || !firstName || !lastName || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("staffNumber", sql.VarChar, staffNumber)
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input("location", sql.VarChar, location)
      .query(`
        UPDATE checkins
        SET staff_number = @staffNumber,
            first_name = @firstName,
            last_name = @lastName,
            location = @location,
            updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Check-in not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error updating check-in:", err);
    res.status(500).json({ error: "Failed to update check-in", message: err.message });
  }
});

// Delete a check-in - protected
app.delete("/api/checkins/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM checkins
        OUTPUT DELETED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Check-in not found" });
    }

    res.json({ message: "Check-in deleted successfully", deletedRecord: result.recordset[0] });
  } catch (err) {
    console.error("Error deleting check-in:", err);
    res.status(500).json({ error: "Failed to delete check-in", message: err.message });
  }
});

// Catch-all (helps debug missing routes)
app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});



