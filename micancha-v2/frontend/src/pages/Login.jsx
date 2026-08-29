import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Card from '../components/Card.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await API.post('/auth/login', form);
      const { token, user } = res.data;
      login(user, token);
      toast.success(`¡Hola de nuevo, ${user.nombre}!`);
      if (user.rol === 'dueno') nav('/owner');
      else if (user.rol === 'admin') nav('/admin');
      else nav('/client');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card title="🔑 Iniciar sesión" className="w-full max-w-sm text-center card-hover">
        <form onSubmit={submit} className="flex flex-col gap-3 text-left">
          <div>
            <label className="label" htmlFor="email">Correo electrónico</label>
            <input id="email" name="email" type="email" className="input" placeholder="tu@correo.com"
              value={form.email} onChange={handle} required />
          </div>
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" className="input" placeholder="••••••••"
              value={form.password} onChange={handle} required />
          </div>
          <button type="submit" className="btn mt-1" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <p className="small mt-4">
          ¿No tienes cuenta? <Link to="/register" className="font-semibold text-brand-700">Regístrate aquí</Link>
        </p>
      </Card>
    </div>
  );
}
