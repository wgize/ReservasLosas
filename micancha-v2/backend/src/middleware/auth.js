// backend/src/middleware/auth.js
// Middleware de autenticación JWT + control de roles.
// A diferencia del MVP anterior, aquí:
//  - No hay secreto por defecto (falla rápido si falta JWT_SECRET).
//  - Se valida que el usuario siga existiendo y no esté bloqueado en cada petición.
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('✖ Falta JWT_SECRET en las variables de entorno (.env).');
  console.error('  Copia backend/.env.example a backend/.env y define un secreto.');
  process.exit(1);
}

/** Verifica el token Bearer y carga el usuario actual desde la BD. */
async function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query(
      'SELECT id, nombre, email, rol, bloqueado FROM usuarios WHERE id = ?',
      [payload.id]
    );
    if (!rows.length || rows[0].bloqueado) {
      return res.status(401).json({ message: 'Sesión inválida' });
    }
    req.user = rows[0];
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

/** Restringe el acceso a los roles indicados. */
function permit(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (!roles.includes(req.user.rol)) return res.status(403).json({ message: 'No autorizado' });
    next();
  };
}

module.exports = { authRequired, permit };
