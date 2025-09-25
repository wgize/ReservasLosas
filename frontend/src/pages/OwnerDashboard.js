import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function OwnerDashboard() {
  const [canchas, setCanchas] = useState([]);
  const [form, setForm] = useState({ nombre:'', zona:'', direccion:'', precio:'', descripcion:'' });
  const [horarios, setHorarios] = useState({});
  const [horarioForm, setHorarioForm] = useState({ cancha_id:'', fecha_inicio:'', fecha_fin:'' });

  const loadCanchas = () => {
    API.get('/canchas/mias').then(res => setCanchas(res.data)).catch(console.error);
  };

  const loadHorarios = (canchaId) => {
    API.get('/horarios', { params: { cancha_id: canchaId } })
      .then(res => setHorarios(prev => ({ ...prev, [canchaId]: res.data })))
      .catch(console.error);
  };

  useEffect(loadCanchas, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const createCancha = async (e) => {
    e.preventDefault();
    await API.post('/canchas', form);
    setForm({ nombre:'', zona:'', direccion:'', precio:'', descripcion:'' });
    loadCanchas();
  };

  const handleHorario = e => setHorarioForm({ ...horarioForm, [e.target.name]: e.target.value });

  const addHorario = async (e) => {
    e.preventDefault();
    await API.post('/horarios', horarioForm);
    setHorarioForm({ cancha_id:'', fecha_inicio:'', fecha_fin:'' });
    loadHorarios(horarioForm.cancha_id);
  };

  return (
    <div>
      <div className="card">
        <h2>Registrar nueva cancha</h2>
        <form onSubmit={createCancha}>
          <div className="form-row">
            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handle} required />
            <input name="zona" placeholder="Zona (ej. Wanchaq)" value={form.zona} onChange={handle} required />
          </div>
          <div className="form-row">
            <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handle} />
            <input name="precio" placeholder="Precio" type="number" value={form.precio} onChange={handle} />
          </div>
          <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handle} />
          <button type="submit">Agregar cancha</button>
        </form>
      </div>

      {canchas.map(c => (
        <div key={c.id} className="card">
          <h3>{c.nombre} — {c.zona}</h3>
          <p className="small">{c.descripcion}</p>

          <h4>🕒 Horarios</h4>
          <button onClick={() => loadHorarios(c.id)}>Ver horarios</button>
          <ul className="list">
            {(horarios[c.id] || []).map(h => (
              <li key={h.id}>
                {new Date(h.fecha_inicio).toLocaleString()} → {new Date(h.fecha_fin).toLocaleString()} 
                {h.disponible ? ' ✅ Disponible' : ' ❌ Ocupado'}
              </li>
            ))}
          </ul>

          <form onSubmit={addHorario}>
            <input type="hidden" name="cancha_id" value={c.id} onChange={handleHorario} />
            <div className="form-row">
              <input type="datetime-local" name="fecha_inicio" onChange={handleHorario} required />
              <input type="datetime-local" name="fecha_fin" onChange={handleHorario} required />
            </div>
            <button type="submit" onClick={() => setHorarioForm({ ...horarioForm, cancha_id: c.id })}>
              Agregar horario
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
