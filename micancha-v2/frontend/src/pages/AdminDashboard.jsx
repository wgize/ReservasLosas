import React, { useEffect, useState, useCallback } from 'react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext.jsx';
import Card from '../components/Card.jsx';

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const [u, r] = await Promise.all([
        API.get('/admin/usuarios'),
        API.get('/admin/reservas')
      ]);
      setUsuarios(u.data);
      setReservas(r.data);
    } catch {
      toast.error('No se pudieron cargar los datos');
    }
  }, [toast]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleBloqueo = async (id, bloquear) => {
    try {
      await API.put(`/admin/usuarios/${id}/bloquear`, { bloquear });
      toast.success(bloquear ? 'Usuario bloqueado' : 'Usuario desbloqueado');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar');
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Eliminar este usuario y sus reservas?')) return;
    try {
      await API.delete(`/admin/usuarios/${id}`);
      toast.success('Usuario eliminado');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const eliminarReserva = async (id) => {
    if (!window.confirm('¿Eliminar esta reserva?')) return;
    try {
      await API.delete(`/admin/reservas/${id}`);
      toast.success('Reserva eliminada');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <Card title="👥 Usuarios">
        <ul className="list">
          {usuarios.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3">
              <div>
                <span className="font-semibold">{u.nombre}</span>{' '}
                <span className="small">({u.email})</span>{' '}
                <span className={`badge ${u.bloqueado ? 'badge-no' : 'badge-ok'}`}>
                  {u.rol}{u.bloqueado ? ' · bloqueado' : ''}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => toggleBloqueo(u.id, !u.bloqueado)}>
                  {u.bloqueado ? 'Desbloquear' : 'Bloquear'}
                </button>
                <button className="btn-danger" onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="📅 Reservas">
        <ul className="list">
          {reservas.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3">
              <span>
                <span className="font-semibold">{r.cliente}</span> — {r.cancha} —{' '}
                <span className="small">{new Date(r.creado_en).toLocaleString()}</span>{' '}
                <span className={`badge ${r.estado === 'confirmada' ? 'badge-ok' : r.estado === 'cancelada' ? 'badge-no' : 'badge-info'}`}>
                  {r.estado}
                </span>
              </span>
              <button className="btn-danger" onClick={() => eliminarReserva(r.id)}>Eliminar</button>
            </li>
          ))}
          {reservas.length === 0 && <li className="small">No hay reservas.</li>}
        </ul>
      </Card>
    </div>
  );
}
