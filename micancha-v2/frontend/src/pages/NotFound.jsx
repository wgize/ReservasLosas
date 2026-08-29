import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card flex flex-col items-center py-16 text-center">
      <div className="mb-3 text-5xl" aria-hidden>🧭</div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Página no encontrada</h1>
      <p className="small mb-5">La ruta que buscas no existe.</p>
      <Link to="/" className="btn">Volver al inicio</Link>
    </div>
  );
}
