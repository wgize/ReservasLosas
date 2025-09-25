// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const horariosRoutes = require('./routes/horarios');
const authRoutes = require('./routes/auth');
const canchasRoutes = require('./routes/canchas');
const reservasRoutes = require('./routes/reservas');
const adminRoutes = require('./routes/admin');


const app = express();
app.use(cors());
app.use(express.json());

// rutas
app.use('/api/auth', authRoutes);
app.use('/api/canchas', canchasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/horarios', horariosRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
