// backend/src/routes/canchas.js
// CRUD de canchas con validación de entrada y control de ownership.
const express = require('express');
const { z } = require('zod');
const db = require('../db');
const { authRequired, permit } = require('../middleware/auth');

const router = express.Router();

const canchaSchema = z.object({
  nombre: z.string().trim().min(2, 'Nombre muy corto').max(120, 'Nombre muy largo'),
  descripcion: z.string().trim().max(1000).optional().default(''),
  zona: z.string().trim().min(1, 'Zona requerida').max(80),
  direccion: z.string().trim().max(200).optional().default(''),
  precio: z.coerce.number().min(0).max(100000).default(0),
  latitud: z.coerce.number().min(-90).max(90).nullable().optional(),
  longitud: z.coerce.number().min(-180).max(180).nullable().optional()
});

const canchaUpdateSchema = canchaSchema.extend({
  activo: z.coerce.number().int().min(0).max(1).default(1)
});

/** GET /api/canchas — búsqueda pública con filtros y paginación */
router.get('/', async (req, res, next) => {
  try {
    const { zona, q } = req.query;
    const pagina = Math.max(1, parseInt(req.query.page, 10) || 1);
    const porPagina = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (pagina - 1) * porPagina;

    let sql = `SELECT c.id, c.nombre, c.descripcion, c.zona, c.direccion, c.precio,
                      c.latitud, c.longitud, u.nombre AS dueno_nombre
               FROM canchas c
               JOIN usuarios u ON c.dueno_id = u.id
               WHERE c.activo = 1`;
    const params = [];

    if (zona) { sql += ' AND c.zona = ?'; params.push(zona); }
    if (q) { sql += ' AND (c.nombre LIKE ? OR c.descripcion LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }

    sql += ' ORDER BY c.creado_en DESC LIMIT ? OFFSET ?';
    params.push(porPagina, offset);

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/** GET /api/canchas/mias — canchas del dueño autenticado (debe ir antes de /:id) */
router.get('/mias', authRequired, permit('dueno'), async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM canchas WHERE dueno_id = ? ORDER BY creado_en DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/** GET /api/canchas/:id — detalle público de una cancha */
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Id inválido' });
    const [rows] = await db.query(
      `SELECT c.*, u.nombre AS dueno_nombre
       FROM canchas c JOIN usuarios u ON c.dueno_id = u.id WHERE c.id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Cancha no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/** POST /api/canchas — crear cancha (dueño) */
router.post('/', authRequired, permit('dueno'), async (req, res, next) => {
  const parsed = canchaSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errores: parsed.error.issues.map((i) => i.message) });
  }
  const { nombre, descripcion, zona, direccion, precio, latitud, longitud } = parsed.data;
  try {
    const [result] = await db.query(
      `INSERT INTO canchas (dueno_id, nombre, descripcion, zona, direccion, precio, latitud, longitud)
       VALUES (?,?,?,?,?,?,?,?)`,
      [req.user.id, nombre, descripcion, zona, direccion, precio, latitud ?? null, longitud ?? null]
    );
    res.status(201).json({ id: result.insertId, dueno_id: req.user.id, nombre, descripcion, zona, direccion, precio });
  } catch (err) {
    next(err);
  }
});

/** PUT /api/canchas/:id — editar (dueño propietario o admin) */
router.put('/:id', authRequired, async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Id inválido' });

  const parsed = canchaUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errores: parsed.error.issues.map((i) => i.message) });
  }

  try {
    const [rows] = await db.query('SELECT dueno_id FROM canchas WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Cancha no encontrada' });
    if (req.user.rol !== 'admin' && req.user.id !== rows[0].dueno_id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const { nombre, descripcion, zona, direccion, precio, latitud, longitud, activo } = parsed.data;
    await db.query(
      `UPDATE canchas
       SET nombre=?, descripcion=?, zona=?, direccion=?, precio=?, latitud=?, longitud=?, activo=?
       WHERE id=?`,
      [nombre, descripcion, zona, direccion, precio, latitud ?? null, longitud ?? null, activo, id]
    );
    res.json({ message: 'Cancha actualizada' });
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/canchas/:id — eliminar (dueño propietario o admin) */
router.delete('/:id', authRequired, async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Id inválido' });

  try {
    const [rows] = await db.query('SELECT dueno_id FROM canchas WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Cancha no encontrada' });
    if (req.user.rol !== 'admin' && req.user.id !== rows[0].dueno_id) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    await db.query('DELETE FROM canchas WHERE id = ?', [id]);
    res.json({ message: 'Cancha eliminada' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
