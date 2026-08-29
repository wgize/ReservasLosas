// backend/src/db.js
// Pool de conexiones MySQL (mysql2/promise) con soporte TLS para Aiven.
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function buildSsl() {
  if (process.env.DB_SSL !== 'true') return undefined;
  // Por defecto: cifrado sin verificar CA (útil en Aiven sin certificado).
  const ssl = { rejectUnauthorized: false };
  // Si se provee el certificado CA, verificar la cadena.
  if (process.env.DB_CA_PATH) {
    ssl.ca = fs.readFileSync(path.resolve(process.env.DB_CA_PATH));
    ssl.rejectUnauthorized = true;
  }
  return ssl;
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  queueLimit: 0,
  charset: 'utf8mb4',
  ssl: buildSsl()
});

module.exports = pool;
