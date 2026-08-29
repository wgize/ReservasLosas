// backend/src/scripts/migrate.js
// Aplica las migraciones SQL de src/migrations/ en orden y las registra en
// la tabla schema_migrations. Uso: npm run migrate
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const db = require('../db');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

function dividirEnSentencias(sql) {
  return sql
    .split(';')
    .map((s) => s.replace(/^\s*--.*$/gm, '').trim())
    .filter(Boolean);
}

async function migrar() {
  const requeridas = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
  for (const k of requeridas) {
    if (!process.env[k]) {
      console.error(`✖ Falta la variable ${k} en backend/.env`);
      process.exit(1);
    }
  }

  const conn = await db.getConnection();
  try {
    await conn.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL UNIQUE,
      aplicada_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    const archivos = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();
    const [aplicadas] = await conn.query('SELECT nombre FROM schema_migrations');
    const setAplicadas = new Set(aplicadas.map((r) => r.nombre));

    for (const archivo of archivos) {
      if (setAplicadas.has(archivo)) {
        console.log(`  ✓ ${archivo} (ya aplicada)`);
        continue;
      }
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, archivo), 'utf8');
      await conn.beginTransaction();
      for (const sentencia of dividirEnSentencias(sql)) {
        await conn.query(sentencia);
      }
      await conn.query('INSERT INTO schema_migrations (nombre) VALUES (?)', [archivo]);
      await conn.commit();
      console.log(`  → ${archivo} aplicada`);
    }
    console.log('Migraciones al día.');
  } catch (err) {
    try { await conn.rollback(); } catch { /* noop */ }
    console.error('✖ Error aplicando migraciones:', err.message);
    process.exit(1);
  } finally {
    conn.release();
    await db.end();
  }
}

migrar();
