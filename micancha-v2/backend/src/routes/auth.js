// backend/src/routes/auth.js
// Registro y login. Fix de auditoría: el rol se valida contra una lista blanca
// (ya no se puede auto-registrar un admin) y se aplica rate limiting.
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { rateLimit } = require('express-rate-limit');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const SALT_ROUNDS = 10;

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);

const loginLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: Number(process.env.RATE_LIMIT_LOGIN_MAX || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de login. Intenta más tarde.' }
});

const registerLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: Number(process.env.RATE_LIMIT_REGISTER_MAX || 5),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados registros. Intenta más tarde.' }
});

const registerSchema = z.object({
  nombre: z.string().trim().min(2, 'Nombre muy corto').max(80, 'Nombre muy largo'),
  email: z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(72, 'Contraseña muy larga'),
  // Solo roles de negocio; 'admin' se crea únicamente con el seed.
  rol: z.enum(['cliente', 'dueno']).default('cliente'),
  telefono: z.string().trim().max(20).optional().nullable()
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(1, 'Password requerido')
});

/** Registro: POST /api/auth/register */
router.post('/register', registerLimiter, async (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errores: parsed.error.issues.map((i) => i.message) });
  }

  const { nombre, email, password, rol, telefono } = parsed.data;
  try {
    const [rows] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length) return res.status(409).json({ message: 'Email ya registrado' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES (?,?,?,?,?)',
      [nombre, email, hash, rol, telefono || null]
    );

    const user = { id: result.insertId, nombre, email, rol };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

/** Login: POST /api/auth/login */
router.post('/login', loginLimiter, async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Email y password requeridos' });

  const { email, password } = parsed.data;
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, email, password, rol, bloqueado FROM usuarios WHERE email = ?',
      [email]
    );
    if (!rows.length) return res.status(401).json({ message: 'Credenciales inválidas' });

    const user = rows[0];
    if (user.bloqueado) return res.status(403).json({ message: 'Cuenta bloqueada' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });

    const payload = { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ user: payload, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
