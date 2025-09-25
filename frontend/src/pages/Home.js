import React from "react";
import "../App.css"; // usamos App.css para los estilos

export default function Home() {
  return (
    <div className="home">
      <div className="home-card">
        <h1 className="brand">Micancha</h1>
        <p className="intro">
          Reserva y administra canchas deportivas en Cusco de manera sencilla y rápida.
        </p>

        <div className="sections">
          <div>
            <h3>Clientes</h3>
            <p>
              Encuentra canchas disponibles en tu zona, filtra por horarios y haz tu reserva online.
            </p>
          </div>

          <div>
            <h3>Dueños</h3>
            <p>
              Publica tus losas deportivas, administra horarios y recibe reservas de forma automática.
            </p>
          </div>

          <div>
            <h3>Administradores</h3>
            <p>
              Supervisa usuarios, controla reservas y garantiza un servicio confiable en la plataforma.
            </p>
          </div>
        </div>

        <div className="cta">
          <button className="btn-primary">Comienza ahora</button>
          <p className="note">Inicia sesión o regístrate desde arriba para empezar a usar el sistema.</p>
        </div>
      </div>
    </div>
  );
}
