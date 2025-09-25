import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HeaderCard() {
  const { user, logout } = useAuth();

  return (
    <div className="card header-card">
      <div className="header-content">
        <Link to="/" className="logo">
          <h2>MiCancha</h2>
        </Link>

        <nav>
          {!user ? (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          ) : (
            <div className="user-info">
              <span>👋 {user.nombre}</span>
              <button className="logout" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
