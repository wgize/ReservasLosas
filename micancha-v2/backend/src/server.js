// backend/src/server.js
// Punto de entrada de la API de MiCancha.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const db = require('./db');
const authRoutes = require('./routes/auth');
const canchasRoutes = require('./routes/canchas');
const horariosRoutes = require('./routes/horarios');
const reservasRoutes = require('./routes/reservas');
const adminRoutes = require('./routes/admin');

const app = express();

// Seguridad básica de cabeceras
app.use(helmet());

// CORS restringido a los orígenes configurados
const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: corsOrigin, credentials: true }));

app.use(express.json({ limit: '1mb' }));

// Health check (útil para Render)
app.get('/api/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', db: 'ok' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'error' });
  }
});

// Rutas de negocio (nombres en español, consistente con el dominio)
app.use('/api/auth', authRoutes);
app.use('/api/canchas', canchasRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/admin', adminRoutes);

// 404 para rutas desconocidas
app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejador global de errores
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`⚽ MiCancha API escuchando en http://localhost:${PORT}`);
});
