const sql = require("mssql");
require("dotenv").config();
const logger = require("./utils/logger");

// Connection configuration
const config = {
  user: process.env.DB_USER,           // e.g. "myusername"
  password: process.env.DB_PASSWORD,   // e.g. "mypassword"
  server: process.env.DB_SERVER,       // e.g. "myserver.database.windows.net"
  database: process.env.DB_NAME,       // e.g. "mydatabase"
  options: {
    encrypt: true,                     // Required for Azure SQL
    trustServerCertificate: false      // Change to true only for local dev
  }
};

// Create a connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Export pool
module.exports = { sql, pool, poolConnect };

// Test the connection
poolConnect
  .then(() => {
    return pool.request().query("SELECT SYSDATETIME() AS CurrentTime");
  })
  .then(result => {
    logger.info("Azure SQL connected. Time:", result.recordset[0].CurrentTime);
  })
  .catch(err => {
    logger.error("Azure SQL connection failed:", err);
  });