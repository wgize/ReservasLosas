// backend/src/scripts/seed.js
// Crea el usuario admin semilla (y con --demo, un dueño + canchas + horarios).
// Uso:
//   npm run seed            -> solo admin
//   npm run seed -- --demo  -> admin + datos de demostración
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const bcrypt = require('bcryptjs');
const db = require('../db');

function fmtLocal(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:00`;
}

async function crearUsuario({ nombre, email, password, rol }) {
  const [rows] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (rows.length) {
    console.log(`  · ${email} ya existe, se omite.`);
    return null;
  }
  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?,?,?,?)',
    [nombre, email, hash, rol]
  );
  console.log(`  · ${rol} creado: ${email}`);
  return result.insertId;
}

async function seed() {
  const requeridas = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
  for (const k of requeridas) {
    if (!process.env[k]) {
      console.error(`✖ Falta la variable ${k} en backend/.env`);
      process.exit(1);
    }
  }

  const demo = process.argv.includes('--demo');

  console.log('Creando admin semilla…');
  await crearUsuario({
    nombre: process.env.ADMIN_NOMBRE || 'Administrador',
    email: process.env.ADMIN_EMAIL || 'admin@micancha.pe',
    password: process.env.ADMIN_PASSWORD || 'admin123456',
    rol: 'admin'
  });

  if (demo) {
    console.log('Creando datos de demostración…');
    const duenoId = await crearUsuario({
      nombre: 'Dueño Demo',
      email: 'dueno@micancha.pe',
      password: 'dueno123456',
      rol: 'dueno'
    });

    if (duenoId) {
      const canchas = [
        { nombre: 'Losa Deportiva Wanchaq', zona: 'Wanchaq', direccion: 'Av. de la Cultura 800', precio: 60, lat: -13.5231, lng: -71.9554, descripcion: 'Fútbol 7 con grass sintético e iluminación.' },
        { nombre: 'Complejo San Sebastián', zona: 'San Sebastián', direccion: 'Jr. Cusco 210', precio: 50, lat: -13.5420, lng: -71.9420, descripcion: 'Cancha de fulbito techada, ideal para noche.' }
      ];

      for (const c of canchas) {
        const [r] = await db.query(
          'INSERT INTO canchas (dueno_id, nombre, descripcion, zona, direccion, precio, latitud, longitud) VALUES (?,?,?,?,?,?,?,?)',
          [duenoId, c.nombre, c.descripcion, c.zona, c.direccion, c.precio, c.lat, c.lng]
        );
        // Horarios de mañana (a partir de mañana a las 8:00)
        const base = new Date();
        base.setDate(base.getDate() + 1);
        base.setHours(8, 0, 0, 0);
        for (let i = 0; i < 4; i++) {
          const inicio = new Date(base.getTime() + i * 60 * 60 * 1000);
          const fin = new Date(inicio.getTime() + 60 * 60 * 1000);
          await db.query(
            'INSERT INTO horarios (cancha_id, fecha_inicio, fecha_fin) VALUES (?,?,?)',
            [r.insertId, fmtLocal(inicio), fmtLocal(fin)]
          );
        }
        console.log(`  · cancha: ${c.nombre} (${c.zona})`);
      }
    }
  }

  await db.end();
  console.log('Seed completado.');
}

seed().catch((err) => {
  console.error('✖ Error en seed:', err.message);
  process.exit(1);
});
