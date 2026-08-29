import React, { useEffect, useState, useCallback } from 'react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext.jsx';
import Card from '../components/Card.jsx';

// Formulario de horario con estado local propio por cancha.
// (Corrige el bug del MVP donde cancha_id podía quedar vacío o desactualizado.)
function HorarioForm({ canchaId, onCreado }) {
  const [form, setForm] = useState({ fecha_inicio: '', fecha_fin: '' });
  const [enviando, setEnviando] = useState(false);
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await API.post('/horarios', {
        cancha_id: canchaId,
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin
      });
      toast.success('Horario agregado');
      setForm({ fecha_inicio: '', fecha_fin: '' });
      onCreado();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al agregar horario');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 rounded-xl bg-gray-50 p-3">
      <div className="form-row">
        <input type="datetime-local" className="input" value={form.fecha_inicio}
          onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} required />
        <input type="datetime-local" className="input" value={form.fecha_fin}
          onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} required />
      </div>
      <button type="submit" className="btn" disabled={enviando}>
        {enviando ? 'Agregando…' : 'Agregar horario'}
      </button>
    </form>
  );
}

export default function OwnerDashboard() {
  const [canchas, setCanchas] = useState([]);
  const [form, setForm] = useState({ nombre: '', zona: '', direccion: '', precio: '', descripcion: '', latitud: '', longitud: '' });
  const [horarios, setHorarios] = useState({});
  const [creando, setCreando] = useState(false);
  const toast = useToast();

  const loadCanchas = useCallback(async () => {
    try {
      const res = await API.get('/canchas/mias');
      setCanchas(res.data);
    } catch {
      toast.error('No se pudieron cargar tus canchas');
    }
  }, [toast]);

  useEffect(() => {
    loadCanchas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createCancha = async (e) => {
    e.preventDefault();
    setCreando(true);
    try {
      await API.post('/canchas', {
        ...form,
        precio: form.precio === '' ? 0 : Number(form.precio),
        latitud: form.latitud === '' ? null : Number(form.latitud),
        longitud: form.longitud === '' ? null : Number(form.longitud)
      });
      toast.success('Cancha registrada');
      setForm({ nombre: '', zona: '', direccion: '', precio: '', descripcion: '', latitud: '', longitud: '' });
      loadCanchas();
    } catch (err) {
      const errores = err.response?.data?.errores;
      toast.error((errores && errores[0]) || err.response?.data?.message || 'Error al crear cancha');
    } finally {
      setCreando(false);
    }
  };

  const loadHorarios = async (canchaId) => {
    try {
      const res = await API.get('/horarios', { params: { cancha_id: canchaId } });
      setHorarios((prev) => ({ ...prev, [canchaId]: res.data }));
    } catch {
      toast.error('No se pudieron cargar los horarios');
    }
  };

  const eliminarHorario = async (canchaId, horarioId) => {
    if (!window.confirm('¿Eliminar este horario?')) return;
    try {
      await API.delete(`/horarios/${horarioId}`);
      toast.success('Horario eliminado');
      loadHorarios(canchaId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const eliminarCancha = async (canchaId) => {
    if (!window.confirm('¿Eliminar esta cancha y sus horarios?')) return;
    try {
      await API.delete(`/canchas/${canchaId}`);
      toast.success('Cancha eliminada');
      loadCanchas();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <Card title="Registrar nueva cancha">
        <form onSubmit={createCancha}>
          <div className="form-row">
            <div className="flex-1">
              <label className="label">Nombre</label>
              <input name="nombre" className="input" placeholder="Ej. Losa Wanchaq" value={form.nombre} onChange={handle} required />
            </div>
            <div className="flex-1">
              <label className="label">Zona</label>
              <input name="zona" className="input" placeholder="Ej. Wanchaq" value={form.zona} onChange={handle} required />
            </div>
          </div>
          <div className="form-row">
            <div className="flex-1">
              <label className="label">Dirección</label>
              <input name="direccion" className="input" placeholder="Av. / Jr. / Ref." value={form.direccion} onChange={handle} />
            </div>
            <div className="flex-1">
              <label className="label">Precio (S/)</label>
              <input name="precio" type="number" min="0" step="0.01" className="input" value={form.precio} onChange={handle} />
            </div>
          </div>
          <div className="form-row">
            <div className="flex-1">
              <label className="label">Latitud (opcional)</label>
              <input name="latitud" type="number" step="any" className="input" placeholder="-13.5170" value={form.latitud} onChange={handle} />
            </div>
            <div className="flex-1">
              <label className="label">Longitud (opcional)</label>
              <input name="longitud" type="number" step="any" className="input" placeholder="-71.9780" value={form.longitud} onChange={handle} />
            </div>
          </div>
          <div className="mb-3">
            <label className="label">Descripción</label>
            <textarea name="descripcion" className="input" placeholder="Descripción de la cancha" value={form.descripcion} onChange={handle} />
          </div>
          <button type="submit" className="btn" disabled={creando}>
            {creando ? 'Guardando…' : 'Agregar cancha'}
          </button>
        </form>
      </Card>

      {canchas.map((c) => (
        <Card key={c.id} className="card-hover">
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{c.nombre} — {c.zona}</h3>
              <p className="small">{c.descripcion}</p>
              <p className="small mt-1">Precio: S/ {Number(c.precio).toFixed(2)} {c.activo ? '' : '· Inactiva'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn-secondary" onClick={() => loadHorarios(c.id)}>Ver horarios</button>
              <button className="btn-danger" onClick={() => eliminarCancha(c.id)}>Eliminar</button>
            </div>
          </div>

          <h4 className="mb-1 text-sm font-bold text-gray-700">🕒 Horarios</h4>
          <ul className="list">
            {(horarios[c.id] || []).map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3">
                <span>
                  {new Date(h.fecha_inicio).toLocaleString()} → {new Date(h.fecha_fin).toLocaleString()}{' '}
                  <span className={`badge ${h.disponible ? 'badge-ok' : 'badge-no'}`}>
                    {h.disponible ? 'Disponible' : 'Ocupado'}
                  </span>
                </span>
                <button className="btn-danger" onClick={() => eliminarHorario(c.id, h.id)}>Eliminar</button>
              </li>
            ))}
            {!horarios[c.id] && <li className="small">Haz clic en "Ver horarios" para cargarlos.</li>}
            {(horarios[c.id] || []).length === 0 && <li className="small">Sin horarios aún.</li>}
          </ul>

          <HorarioForm canchaId={c.id} onCreado={() => loadHorarios(c.id)} />
        </Card>
      ))}
    </div>
  );
}
