require("dotenv").config();
const sql = require("mssql");

const dbConfig = {
  server: process.env.DB_SERVER, // Usa la variable con la instancia SQLEXPRESS
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log("✅ Conectado a SQL Server");
    return pool;
  })
  .catch(err => {
    console.error("❌ Error conectando a SQL Server:", err);
  });

module.exports = { sql, poolPromise };