// backend/routes/reservas.js
const express = require('express');
const db = require('../db');
const { authRequired, permit } = require('../middleware/auth');

const router = express.Router();

// GET all reservas (admin) or reservas del usuario (cliente) o del dueño (ver reservas en sus canchas)
router.get('/', authRequired, (req, res) => {
  const user = req.user;
  if (user.rol === 'admin') {
    return db.query(`SELECT r.*, u.nombre as cliente, c.nombre as cancha
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN canchas c ON r.cancha_id = c.id
      ORDER BY r.creado_en DESC`, (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
      });
  }

  if (user.rol === 'dueno') {
    // obtener reservas de las canchas del dueño
    return db.query(`SELECT r.*, u.nombre as cliente, c.nombre as cancha
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN canchas c ON r.cancha_id = c.id
      WHERE c.dueno_id = ? ORDER BY r.creado_en DESC`, [user.id], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
      });
  }

  // cliente -> sus reservas
  db.query(`SELECT r.*, c.nombre as cancha FROM reservas r JOIN canchas c ON r.cancha_id = c.id WHERE r.usuario_id = ? ORDER BY r.creado_en DESC`, [user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// POST crear reserva (cliente) -> body: { cancha_id, horario_id }
router.post('/', authRequired, permit('cliente'), (req, res) => {
  const usuario_id = req.user.id;
  const { cancha_id, horario_id } = req.body;
  // validar horario disponible
  db.query('SELECT disponible FROM horarios WHERE id = ? AND cancha_id = ?', [horario_id, cancha_id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!rows.length) return res.status(400).json({ message: 'Horario no encontrado' });
    if (!rows[0].disponible) return res.status(400).json({ message: 'Horario no disponible' });
    // insertar reserva y marcar horario no disponible
    db.query('INSERT INTO reservas (usuario_id, cancha_id, horario_id, estado) VALUES (?,?,?,?)',
      [usuario_id, cancha_id, horario_id, 'confirmada'], (err2, result) => {
        if (err2) return res.status(500).json({ message: err2.message });
        db.query('UPDATE horarios SET disponible = 0 WHERE id = ?', [horario_id], () => {
          res.json({ id: result.insertId, usuario_id, cancha_id, horario_id, estado: 'confirmada' });
        });
      });
  });
});

// PUT cancelar reserva (cliente) o admin
router.put('/:id/cancel', authRequired, (req, res) => {
  const id = req.params.id;
  const requester = req.user;
  db.query('SELECT * FROM reservas WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!rows.length) return res.status(404).json({ message: 'Reserva no encontrada' });
    const reserva = rows[0];
    // cliente solo puede cancelar su reserva
    if (requester.rol === 'cliente' && reserva.usuario_id !== requester.id) return res.status(403).json({ message: 'No autorizado' });
    db.query('UPDATE reservas SET estado = ? WHERE id = ?', ['cancelada', id], (err2) => {
      if (err2) return res.status(500).json({ message: err2.message });
      // liberar horario
      db.query('UPDATE horarios SET disponible = 1 WHERE id = ?', [reserva.horario_id], () => {
        res.json({ message: 'Reserva cancelada' });
      });
    });
  });
});

module.exports = router;
