import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/');
  };

  const dashboardPath =
    user?.rol === 'dueno' ? '/owner' : user?.rol === 'admin' ? '/admin' : user ? '/client' : null;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-brand-700">
          <span aria-hidden>⚽</span> MiCancha
        </Link>

        <nav className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-brand-700">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn">
                Registrarse
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {dashboardPath && (
                <Link to={dashboardPath} className="text-sm font-semibold text-gray-600 hover:text-brand-700">
                  Mi panel
                </Link>
              )}
              <span className="text-sm font-semibold text-gray-800">👋 {user.nombre}</span>
              <button className="btn-secondary" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
