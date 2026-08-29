// backend/src/routes/horarios.js
// Horarios de las canchas. Fix de auditoría: PUT y DELETE ahora validan
// que quien llama sea el dueño de la cancha o un admin.
const express = require('express');
const { z } = require('zod');
const db = require('../db');
const { authRequired, permit } = require('../middleware/auth');

const router = express.Router();

function validarRango(fecha_inicio, fecha_fin) {
  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);
  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return 'Fechas inválidas';
  if (fin <= inicio) return 'fecha_fin debe ser posterior a fecha_inicio';
  return null;
}

const horarioSchema = z.object({
  cancha_id: z.coerce.number().int().positive('cancha_id requerido'),
  fecha_inicio: z.string().min(1, 'fecha_inicio requerida'),
  fecha_fin: z.string().min(1, 'fecha_fin requerida')
});

/** POST /api/horarios — crear horario (dueño de la cancha) */
router.post('/', authRequired, permit('dueno'), async (req, res, next) => {
  const parsed = horarioSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errores: parsed.error.issues.map((i) => i.message) });
  }
  const { cancha_id, fecha_inicio, fecha_fin } = parsed.data;

  const errorRango = validarRango(fecha_inicio, fecha_fin);
  if (errorRango) return res.status(400).json({ message: errorRango });

  try {
    const [rows] = await db.query('SELECT dueno_id FROM canchas WHERE id = ?', [cancha_id]);
    if (!rows.length) return res.status(404).json({ message: 'Cancha no encontrada' });
    if (rows[0].dueno_id !== req.user.id) return res.status(403).json({ message: 'No autorizado' });

    const [result] = await db.query(
      'INSERT INTO horarios (cancha_id, fecha_inicio, fecha_fin, disponible) VALUES (?,?,?,1)',
      [cancha_id, fecha_inicio, fecha_fin]
    );
    res.status(201).json({ id: result.insertId, cancha_id, fecha_inicio, fecha_fin, disponible: 1 });
  } catch (err) {
    next(err);
  }
});

/** GET /api/horarios?cancha_id= — listar horarios de una cancha */
router.get('/', async (req, res, next) => {
  const cancha_id = Number(req.query.cancha_id);
  if (!Number.isInteger(cancha_id) || cancha_id <= 0) {
    return res.status(400).json({ message: 'cancha_id requerido' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM horarios WHERE cancha_id = ? ORDER BY fecha_inicio', [cancha_id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/** PUT /api/horarios/:id — actualizar (dueño de la cancha o admin) */
router.put('/:id', authRequired, async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Id inválido' });

  const schema = z.object({ disponible: z.coerce.number().int().min(0).max(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errores: parsed.error.issues.map((i) => i.message) });
  }

  try {
    const [rows] = await db.query(
      'SELECT h.id, c.dueno_id FROM horarios h JOIN canchas c ON c.id = h.cancha_id WHERE h.id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Horario no encontrado' });
    if (req.user.rol !== 'admin' && req.user.id !== rows[0].dueno_id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await db.query('UPDATE horarios SET disponible = ? WHERE id = ?', [parsed.data.disponible, id]);
    res.json({ message: 'Horario actualizado' });
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/horarios/:id — eliminar (dueño de la cancha o admin) */
router.delete('/:id', authRequired, async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Id inválido' });

  try {
    const [rows] = await db.query(
      'SELECT h.id, c.dueno_id FROM horarios h JOIN canchas c ON c.id = h.cancha_id WHERE h.id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Horario no encontrado' });
    if (req.user.rol !== 'admin' && req.user.id !== rows[0].dueno_id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await db.query('DELETE FROM horarios WHERE id = ?', [id]);
    res.json({ message: 'Horario eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
