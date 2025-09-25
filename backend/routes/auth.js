// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '8h';
const SALT_ROUNDS = 10;

/** Registro: POST /api/auth/register
 * body: { nombre, email, password, rol (cliente|dueno) , telefono? }
 */
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol = 'cliente', telefono } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ message: 'Campos faltantes' });

    // verificar email único
    db.query('SELECT id FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length) return res.status(400).json({ message: 'Email ya registrado' });

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      db.query('INSERT INTO usuarios (nombre,email,password,rol,telefono) VALUES (?,?,?,?,?)',
        [nombre, email, hash, rol, telefono || null], (err2, result) => {
          if (err2) return res.status(500).json({ message: err2.message });
          const user = { id: result.insertId, nombre, email, rol };
          const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES });
          res.json({ user, token });
        });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** Login: POST /api/auth/login
 * body: { email, password }
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email y password requeridos' });

  db.query('SELECT id,nombre,email,password,rol,bloqueado FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!results.length) return res.status(400).json({ message: 'Credenciales inválidas' });

    const user = results[0];
    if (user.bloqueado) return res.status(403).json({ message: 'Cuenta bloqueada' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Credenciales inválidas' });

    const payload = { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
    // no enviar password
    res.json({ user: payload, token });
  });
});

module.exports = router;
