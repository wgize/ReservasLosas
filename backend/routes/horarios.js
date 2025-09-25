const express = require('express');
const db = require('../db');
const { authRequired, permit } = require('../middleware/auth');

const router = express.Router();

/** Crear horario para una cancha (dueño) */
router.post('/', authRequired, permit('dueno'), (req, res) => {
  const { cancha_id, fecha_inicio, fecha_fin } = req.body;
  if (!cancha_id || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ message: 'Faltan campos' });
  }
  // validar que la cancha pertenece al dueño
  db.query('SELECT dueno_id FROM canchas WHERE id=?', [cancha_id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!rows.length) return res.status(404).json({ message: 'Cancha no encontrada' });
    if (rows[0].dueno_id !== req.user.id) return res.status(403).json({ message: 'No autorizado' });

    db.query('INSERT INTO horarios (cancha_id,fecha_inicio,fecha_fin,disponible) VALUES (?,?,?,1)',
      [cancha_id, fecha_inicio, fecha_fin], (err2, result) => {
        if (err2) return res.status(500).json({ message: err2.message });
        res.json({ id: result.insertId, cancha_id, fecha_inicio, fecha_fin, disponible: 1 });
      });
  });
});

/** Listar horarios de una cancha */
router.get('/', (req, res) => {
  const { cancha_id } = req.query;
  if (!cancha_id) return res.status(400).json({ message: 'cancha_id requerido' });
  db.query('SELECT * FROM horarios WHERE cancha_id=? ORDER BY fecha_inicio', [cancha_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

/** Actualizar disponibilidad (dueño o admin) */
router.put('/:id', authRequired, (req, res) => {
  const { id } = req.params;
  const { disponible } = req.body;
  db.query('UPDATE horarios SET disponible=? WHERE id=?', [disponible ? 1 : 0, id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Horario actualizado' });
  });
});

/** Eliminar horario (dueño/admin) */
router.delete('/:id', authRequired, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM horarios WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Horario eliminado' });
  });
});

module.exports = router;
