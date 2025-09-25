// backend/routes/canchas.js
const express = require('express');
const db = require('../db');
const { authRequired, permit } = require('../middleware/auth');

const router = express.Router();

/** GET /api/canchas  --> búsqueda pública con filtros ?zona=&q=&page=&limit= */
router.get('/', (req, res) => {
  const { zona, q, page = 1, limit = 20 } = req.query;
  let sql = 'SELECT c.*, u.nombre as dueno_nombre, u.email as dueno_email FROM canchas c JOIN usuarios u ON c.dueno_id = u.id WHERE c.activo = 1';
  const params = [];
  if (zona) { sql += ' AND c.zona = ?'; params.push(zona); }
  if (q) { sql += ' AND (c.nombre LIKE ? OR c.descripcion LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
  sql += ' ORDER BY c.creado_en DESC LIMIT ? OFFSET ?';
  const offset = (page - 1) * limit;
  params.push(Number(limit), Number(offset));
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

/** POST /api/canchas -> crear (dueño) */
router.post('/', authRequired, permit('dueno'), (req, res) => {
  const dueno_id = req.user.id;
  const { nombre, descripcion, zona, direccion, precio } = req.body;
  db.query('INSERT INTO canchas (dueno_id,nombre,descripcion,zona,direccion,precio) VALUES (?,?,?,?,?,?)',
    [dueno_id, nombre, descripcion, zona, direccion, precio || 0], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ id: result.insertId, dueno_id, nombre, descripcion, zona, direccion, precio });
    });
});

/** PUT /api/canchas/:id -> editar (dueño propietario o admin) */
router.put('/:id', authRequired, (req, res) => {
  const id = req.params.id;
  const updater = req.user;
  // verificar que es dueño del recurso o admin
  db.query('SELECT dueno_id FROM canchas WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!results.length) return res.status(404).json({ message: 'Cancha no encontrada' });
    const ownerId = results[0].dueno_id;
    if (updater.rol !== 'admin' && updater.id !== ownerId) return res.status(403).json({ message: 'No autorizado' });
    const { nombre, descripcion, zona, direccion, precio, activo } = req.body;
    db.query('UPDATE canchas SET nombre=?,descripcion=?,zona=?,direccion=?,precio=?,activo=? WHERE id=?',
      [nombre, descripcion, zoneOrDefault(zona), direccion, precio || 0, activo === undefined ? 1 : activeToBool(activo), id],
      (err2) => {
        if (err2) return res.status(500).json({ message: err2.message });
        res.json({ message: 'Actualizado' });
      });
  });
});

function zoneOrDefault(z) { return z || null; }
function activeToBool(a) { return a ? 1 : 0; }

/** DELETE /api/canchas/:id -> dueño propietario o admin */
router.delete('/:id', authRequired, (req, res) => {
  const id = req.params.id;
  const requester = req.user;
  db.query('SELECT dueno_id FROM canchas WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!results.length) return res.status(404).json({ message: 'Cancha no encontrada' });
    const ownerId = results[0].dueno_id;
    if (requester.rol !== 'admin' && requester.id !== ownerId) return res.status(403).json({ message: 'No autorizado' });
    db.query('DELETE FROM canchas WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ message: err2.message });
      res.json({ message: 'Eliminado' });
    });
  });
});

/** GET /api/canchas/mias -> dueños: ver sus propias canchas */
router.get('/mias', authRequired, permit('dueno'), (req, res) => {
  const dueno_id = req.user.id;
  db.query('SELECT * FROM canchas WHERE dueno_id = ?', [dueno_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});


module.exports = router;
