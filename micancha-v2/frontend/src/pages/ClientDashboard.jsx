import React, { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext.jsx';
import Card from '../components/Card.jsx';
import MapView from '../components/MapView.jsx';

function esFuturo(fecha) {
  return new Date(fecha).getTime() > Date.now();
}

export default function ClientDashboard() {
  const [filtro, setFiltro] = useState({ zona: '', q: '' });
  const [canchas, setCanchas] = useState([]);
  const [horarios, setHorarios] = useState({});
  const [abiertas, setAbiertas] = useState({});
  const [cargando, setCargando] = useState(false);
  const toast = useToast();

  const search = useCallback(async (f) => {
    setCargando(true);
    try {
      const res = await API.get('/canchas', { params: f });
      setCanchas(res.data);
    } catch {
      toast.error('No se pudieron cargar las canchas');
    } finally {
      setCargando(false);
    }
  }, [toast]);

  useEffect(() => {
    search(filtro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleHorarios = async (canchaId) => {
    const yaAbierta = abiertas[canchaId];
    setAbiertas((prev) => ({ ...prev, [canchaId]: !yaAbierta }));
    if (!yaAbierta && !horarios[canchaId]) {
      try {
        const res = await API.get('/horarios', { params: { cancha_id: canchaId } });
        setHorarios((prev) => ({ ...prev, [canchaId]: res.data }));
      } catch {
        toast.error('No se pudieron cargar los horarios');
      }
    }
  };

  const reservar = async (canchaId, horarioId) => {
    try {
      await API.post('/reservas', { cancha_id: canchaId, horario_id: horarioId });
      toast.success('✅ Reserva confirmada');
      const res = await API.get('/horarios', { params: { cancha_id: canchaId } });
      setHorarios((prev) => ({ ...prev, [canchaId]: res.data }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al reservar');
    }
  };

  return (
    <div>
      <Card title="🔍 Buscar canchas">
        <div className="form-row">
          <input className="input" placeholder="Zona (ej. Wanchaq)" value={filtro.zona}
            onChange={(e) => setFiltro({ ...filtro, zona: e.target.value })} />
          <input className="input" placeholder="Nombre o descripción" value={filtro.q}
            onChange={(e) => setFiltro({ ...filtro, q: e.target.value })} />
          <button className="btn" onClick={() => search(filtro)} disabled={cargando}>
            {cargando ? 'Buscando…' : 'Buscar'}
          </button>
        </div>
      </Card>

      {canchas.length === 0 && !cargando && (
        <Card><p className="small">No hay canchas para mostrar. Prueba otra búsqueda.</p></Card>
      )}

      {canchas.map((c) => {
        const lista = horarios[c.id] || [];
        return (
          <Card key={c.id} className="card-hover">
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{c.nombre}</h3>
                <p className="small">{c.descripcion}</p>
                <p className="small mt-1">
                  📍 Zona: {c.zona} — Dirección: {c.direccion} — Precio: S/ {Number(c.precio).toFixed(2)}
                </p>
              </div>
              <button className="btn-secondary whitespace-nowrap" onClick={() => toggleHorarios(c.id)}>
                {abiertas[c.id] ? 'Ocultar horarios' : 'Ver horarios'}
              </button>
            </div>

            {c.latitud != null && c.longitud != null && (
              <div className="mb-3">
                <MapView lat={Number(c.latitud)} lng={Number(c.longitud)} nombre={c.nombre} height={180} />
              </div>
            )}

            {abiertas[c.id] && (
              <ul className="list">
                {lista.map((h) => {
                  const futuro = esFuturo(h.fecha_inicio);
                  const reservable = h.disponible && futuro;
                  return (
                    <li key={h.id} className="flex items-center justify-between gap-3">
                      <span className={futuro ? '' : 'text-gray-400'}>
                        🕒 {new Date(h.fecha_inicio).toLocaleString()} → {new Date(h.fecha_fin).toLocaleString()}
                      </span>
                      {reservable ? (
                        <button className="btn" onClick={() => reservar(c.id, h.id)}>Reservar</button>
                      ) : (
                        <span className={`badge ${futuro ? 'badge-no' : 'badge-info'}`}>
                          {futuro ? 'No disponible' : 'Pasado'}
                        </span>
                      )}
                    </li>
                  );
                })}
                {lista.length === 0 && <li className="small">Esta cancha no tiene horarios publicados.</li>}
              </ul>
            )}
          </Card>
        );
      })}
    </div>
  );
}
