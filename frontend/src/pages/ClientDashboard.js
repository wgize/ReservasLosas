import React, { useState, useEffect } from 'react';
import API from '../utils/api';

export default function ClientDashboard() {
  const [filtro, setFiltro] = useState({ zona:'', q:'' });
  const [canchas, setCanchas] = useState([]);
  const [horarios, setHorarios] = useState({});

  const search = () => {
    API.get('/canchas', { params: filtro })
      .then(res => setCanchas(res.data))
      .catch(console.error);
  };

  const loadHorarios = (canchaId) => {
    API.get('/horarios', { params: { cancha_id: canchaId } })
      .then(res => setHorarios(prev => ({ ...prev, [canchaId]: res.data })))
      .catch(console.error);
  };

  const reservar = async (canchaId, horarioId) => {
    try {
      await API.post('/reservas', { cancha_id: canchaId, horario_id: horarioId });
      alert('✅ Reserva confirmada');
      loadHorarios(canchaId);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al reservar');
    }
  };

  useEffect(search, []);

  return (
    <div>
      <div className="card">
        <h2>🔍 Buscar canchas</h2>
        <div className="form-row">
          <input placeholder="Zona" value={filtro.zona} onChange={e => setFiltro({...filtro, zona: e.target.value})} />
          <input placeholder="Nombre o descripción" value={filtro.q} onChange={e => setFiltro({...filtro, q: e.target.value})} />
          <button onClick={search}>Buscar</button>
        </div>
      </div>

      {canchas.map(c => (
        <div key={c.id} className="card">
          <h3>{c.nombre}</h3>
          <p>{c.descripcion}</p>
          <p className="small">Zona: {c.zona} — Dirección: {c.direccion} — Precio: S/ {c.precio}</p>
          <button onClick={() => loadHorarios(c.id)}>Ver horarios</button>
          <ul className="list">
            {(horarios[c.id] || []).map(h => (
              <li key={h.id}>
                {new Date(h.fecha_inicio).toLocaleString()} → {new Date(h.fecha_fin).toLocaleString()}
                {h.disponible 
                  ? <button onClick={() => reservar(c.id, h.id)} style={{marginLeft:10}}>Reservar</button>
                  : ' ❌ No disponible'}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
