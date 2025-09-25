import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReservaList() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/reservas')
      .then(res => setReservas(res.data))
      .catch(err => console.error("Error cargando reservas:", err));
  }, []);

  return (
    <div>
      <h2>📋 Lista de Reservas</h2>
      <ul>
        {reservas.map(r => (
          <li key={r.id}>
            {r.usuario} reservó {r.cancha} para {new Date(r.fecha).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReservaList;
