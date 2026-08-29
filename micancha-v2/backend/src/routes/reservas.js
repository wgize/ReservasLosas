// backend/src/routes/reservas.js
// Reservas con transacción y bloqueo (SELECT ... FOR UPDATE) para evitar
// doble reserva del mismo horario.
const express = require('express');
const { z } = require('zod');
const db = require('../db');
const { authRequired, permit } = require('../middleware/auth');

const router = express.Router();

/** GET /api/reservas — reservas según rol (admin: todas, dueño: de sus canchas, cliente: propias) */
router.get('/', authRequired, async (req, res, next) => {
  const user = req.user;
  try {
    if (user.rol === 'admin') {
      const [rows] = await db.query(
        `SELECT r.*, u.nombre AS cliente, c.nombre AS cancha
         FROM reservas r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN canchas c ON r.cancha_id = c.id
         ORDER BY r.creado_en DESC`
      );
      return res.json(rows);
    }

    if (user.rol === 'dueno') {
      const [rows] = await db.query(
        `SELECT r.*, u.nombre AS cliente, c.nombre AS cancha
         FROM reservas r
         JOIN usuarios u ON r.usuario_id = u.id
         JOIN canchas c ON r.cancha_id = c.id
         WHERE c.dueno_id = ? ORDER BY r.creado_en DESC`,
        [user.id]
      );
      return res.json(rows);
    }

    const [rows] = await db.query(
      `SELECT r.*, c.nombre AS cancha
       FROM reservas r JOIN canchas c ON r.cancha_id = c.id
       WHERE r.usuario_id = ? ORDER BY r.creado_en DESC`,
      [user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/** POST /api/reservas — crear reserva (cliente) con transacción y FOR UPDATE */
router.post('/', authRequired, permit('cliente'), async (req, res, next) => {
  const schema = z.object({
    cancha_id: z.coerce.number().int().positive('cancha_id requerido'),
    horario_id: z.coerce.number().int().positive('horario_id requerido')
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errores: parsed.error.issues.map((i) => i.message) });
  }
  const { cancha_id, horario_id } = parsed.data;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Bloquea la cancha para validar que exista y esté activa.
    const [canchas] = await conn.query('SELECT id, activo FROM canchas WHERE id = ? FOR UPDATE', [cancha_id]);
    if (!canchas.length || !canchas[0].activo) {
      await conn.rollback();
      return res.status(400).json({ message: 'Cancha no disponible' });
    }

    // Bloquea el horario: serializa las reservas concurrentes del mismo slot.
    const [horarios] = await conn.query(
      'SELECT disponible, fecha_inicio FROM horarios WHERE id = ? AND cancha_id = ? FOR UPDATE',
      [horario_id, cancha_id]
    );
    if (!horarios.length) {
      await conn.rollback();
      return res.status(404).json({ message: 'Horario no encontrado' });
    }
    if (!horarios[0].disponible) {
      await conn.rollback();
      return res.status(409).json({ message: 'Horario no disponible' });
    }
    if (new Date(horarios[0].fecha_inicio) <= new Date()) {
      await conn.rollback();
      return res.status(400).json({ message: 'El horario ya pasó' });
    }

    const [result] = await conn.query(
      'INSERT INTO reservas (usuario_id, cancha_id, horario_id, estado) VALUES (?,?,?,?)',
      [req.user.id, cancha_id, horario_id, 'confirmada']
    );
    await conn.query('UPDATE horarios SET disponible = 0 WHERE id = ?', [horario_id]);

    await conn.commit();
    res.status(201).json({ id: result.insertId, usuario_id: req.user.id, cancha_id, horario_id, estado: 'confirmada' });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
});

/** PUT /api/reservas/:id/cancel — cancelar (cliente dueño de la reserva, dueño de la cancha o admin) */
router.put('/:id/cancel', authRequired, async (req, res, next) => {
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

    let autorizado = false;
    if (req.user.rol === 'admin') {
      autorizado = true;
    } else if (req.user.rol === 'cliente' && reserva.usuario_id === req.user.id) {
      autorizado = true;
    } else if (req.user.rol === 'dueno') {
      const [c] = await conn.query('SELECT dueno_id FROM canchas WHERE id = ?', [reserva.cancha_id]);
      if (c.length && c[0].dueno_id === req.user.id) autorizado = true;
    }

    if (!autorizado) {
      await conn.rollback();
      return res.status(403).json({ message: 'No autorizado' });
    }
    if (reserva.estado === 'cancelada') {
      await conn.rollback();
      return res.status(400).json({ message: 'La reserva ya está cancelada' });
    }

    await conn.query('UPDATE reservas SET estado = ? WHERE id = ?', ['cancelada', id]);
    await conn.query('UPDATE horarios SET disponible = 1 WHERE id = ?', [reserva.horario_id]);

    await conn.commit();
    res.json({ message: 'Reserva cancelada' });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
});

module.exports = router;
