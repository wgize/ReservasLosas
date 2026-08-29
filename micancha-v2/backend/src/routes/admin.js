// backend/src/routes/admin.js
// Panel de administración. Protegido con authRequired + permit('admin').
const express = require('express');
const db = require('../db');
const { authRequired, permit } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired, permit('admin'));

/** GET /api/admin/usuarios */
router.get('/usuarios', async (_req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, email, rol, telefono, direccion, bloqueado, creado_en FROM usuarios ORDER BY creado_en DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/** PUT /api/admin/usuarios/:id/bloquear */
router.put('/usuarios/:id/bloquear', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Id inválido' });
  if (id === req.user.id) return res.status(400).json({ message: 'No puedes bloquearte a ti mismo' });

  const bloquear = req.body.bloquear ? 1 : 0;
  try {
    const [result] = await db.query('UPDATE usuarios SET bloqueado = ? WHERE id = ?', [bloquear, id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/admin/usuarios/:id */
router.delete('/usuarios/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Id inválido' });
  if (id === req.user.id) return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });

  try {
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    next(err);
  }
});

/** GET /api/admin/reservas */
router.get('/reservas', async (_req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.nombre AS cliente, c.nombre AS cancha
       FROM reservas r
       JOIN usuarios u ON r.usuario_id = u.id
       JOIN canchas c ON r.cancha_id = c.id
       ORDER BY r.creado_en DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/admin/reservas/:id — elimina la reserva y libera el horario si procede */
router.delete('/reservas/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Id inválido' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM reservas WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) {
      await conn.rollback();
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    const reserva = rows[0];
    await conn.query('DELETE FROM reservas WHERE id = ?', [id]);
    if (reserva.estado !== 'cancelada') {
      await conn.query('UPDATE horarios SET disponible = 1 WHERE id = ?', [reserva.horario_id]);
    }
    await conn.commit();
    res.json({ message: 'Reserva eliminada' });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
});

module.exports = router;
