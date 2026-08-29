import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const SECCIONES = [
  {
    icono: '🙋',
    titulo: 'Clientes',
    texto: 'Encuentra canchas disponibles en tu zona, filtra por horarios y haz tu reserva online.'
  },
  {
    icono: '🏟️',
    titulo: 'Dueños',
    texto: 'Publica tus losas deportivas, administra horarios y recibe reservas de forma automática.'
  },
  {
    icono: '🛡️',
    titulo: 'Administradores',
    texto: 'Supervisa usuarios, controla reservas y garantiza un servicio confiable en la plataforma.'
  }
];

export default function Home() {
  const { user } = useAuth();
  const destino = user ? '/client' : '/register';

  return (
    <div className="flex flex-col items-center">
      <section className="card card-hover w-full text-center" style={{ padding: '2.5rem' }}>
        <h1 className="mb-2 text-4xl font-extrabold text-brand-700">MiCancha</h1>
        <p className="mb-6 text-lg text-gray-600">
          Reserva y administra canchas deportivas en Cusco de manera sencilla y rápida.
        </p>

        <div className="mb-8 grid gap-5 text-left sm:grid-cols-3">
          {SECCIONES.map((s) => (
            <div key={s.titulo} className="rounded-xl bg-gray-50 p-5">
              <div className="mb-2 text-3xl" aria-hidden>{s.icono}</div>
              <h3 className="mb-1 text-lg font-bold text-gray-900">{s.titulo}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{s.texto}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <Link to={destino} className="btn px-6 py-3 text-base">
            Comienza ahora
          </Link>
          <p className="note text-sm text-gray-500">
            Inicia sesión o regístrate para empezar a usar el sistema.
          </p>
        </div>
      </section>
    </div>
  );
}
