// backend/routes/admin.js
const express = require('express');
const db = require('../db');
const { authRequired, permit } = require('../middleware/auth');

const router = express.Router();

// Todos los endpoints protegidos sólo para admin
router.use(authRequired, permit('admin'));

// Listar usuarios
router.get('/usuarios', (req, res) => {
  db.query('SELECT id,nombre,email,rol,telefono,direccion,bloqueado,creado_en FROM usuarios', (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// Bloquear / desbloquear usuario
router.put('/usuarios/:id/bloquear', (req, res) => {
  const id = req.params.id;
  const { bloquear } = req.body; // boolean
  db.query('UPDATE usuarios SET bloqueado = ? WHERE id = ?', [bloquear ? 1 : 0, id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Actualizado' });
  });
});

// Eliminar usuario
router.delete('/usuarios/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Usuario eliminado' });
  });
});

// Listar reservas (admin)
router.get('/reservas', (req, res) => {
  db.query('SELECT r.*, u.nombre as cliente, c.nombre as cancha FROM reservas r JOIN usuarios u ON r.usuario_id = u.id JOIN canchas c ON r.cancha_id = c.id', (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// Eliminar reserva
router.delete('/reservas/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM reservas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Reserva eliminada' });
  });
});

module.exports = router;
