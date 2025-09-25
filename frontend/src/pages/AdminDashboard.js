import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);

  const load = () => {
    API.get('/admin/usuarios').then(res => setUsuarios(res.data)).catch(console.error);
    API.get('/admin/reservas').then(res => setReservas(res.data)).catch(console.error);
  };

  useEffect(load, []);

  const toggleBloqueo = async (id, bloquear) => {
    await API.put(`/admin/usuarios/${id}/bloquear`, { bloquear });
    load();
  };

  const delUser = async (id) => {
    if (!window.confirm('Eliminar usuario?')) return;
    await API.delete(`/admin/usuarios/${id}`);
    load();
  };

  return (
    <div>
      <div className="card">
        <h3>Usuarios</h3>
        <ul className="list">
          {usuarios.map(u => (
            <li key={u.id}>
              {u.nombre} ({u.email}) - {u.rol}
              <div className="actions">
                <button onClick={() => toggleBloqueo(u.id, !u.bloqueado)}>{u.bloqueado ? 'Desbloquear' : 'Bloquear'}</button>
                <button onClick={() => delUser(u.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Reservas</h3>
        <ul className="list">
          {reservas.map(r => (
            <li key={r.id}>
              {r.cliente} - {r.cancha} - {new Date(r.creado_en).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
