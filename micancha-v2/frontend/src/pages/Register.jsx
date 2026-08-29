import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Card from '../components/Card.jsx';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'cliente' });
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await API.post('/auth/register', form);
      const { token, user } = res.data;
      login(user, token);
      toast.success('¡Cuenta creada! Bienvenido a MiCancha.');
      nav(user.rol === 'dueno' ? '/owner' : '/client');
    } catch (err) {
      const msg = err.response?.data?.message;
      const errores = err.response?.data?.errores;
      toast.error((errores && errores[0]) || msg || 'Error al registrar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card title="📝 Crear cuenta" className="w-full max-w-sm text-center card-hover">
        <form onSubmit={submit} className="flex flex-col gap-3 text-left">
          <div>
            <label className="label" htmlFor="nombre">Nombre completo</label>
            <input id="nombre" name="nombre" className="input" placeholder="Tu nombre"
              value={form.nombre} onChange={handle} required />
          </div>
          <div>
            <label className="label" htmlFor="email">Correo electrónico</label>
            <input id="email" name="email" type="email" className="input" placeholder="tu@correo.com"
              value={form.email} onChange={handle} required />
          </div>
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" className="input" placeholder="Mínimo 6 caracteres"
              value={form.password} onChange={handle} required minLength={6} />
          </div>
          <div>
            <label className="label" htmlFor="rol">Tipo de cuenta</label>
            <select id="rol" name="rol" className="input" value={form.rol} onChange={handle}>
              <option value="cliente">Cliente</option>
              <option value="dueno">Dueño</option>
            </select>
          </div>
          <button type="submit" className="btn mt-1" disabled={enviando}>
            {enviando ? 'Creando…' : 'Registrar'}
          </button>
        </form>
        <p className="small mt-4">
          ¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-brand-700">Inicia sesión</Link>
        </p>
      </Card>
    </div>
  );
}
