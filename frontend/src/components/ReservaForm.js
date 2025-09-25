import React, { useState } from 'react';
import axios from 'axios';

function ReservaForm() {
  const [usuario, setUsuario] = useState('');
  const [cancha, setCancha] = useState('');
  const [fecha, setFecha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/reservas', {
        usuario,
        cancha,
        fecha
      });
      alert('✅ Reserva creada');
      setUsuario('');
      setCancha('');
      setFecha('');
    } catch (err) {
      alert('❌ Error al crear la reserva');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Nombre del usuario"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Nombre de la cancha"
        value={cancha}
        onChange={e => setCancha(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={fecha}
        onChange={e => setFecha(e.target.value)}
        required
      />
      <button type="submit">Reservar</button>
    </form>
  );
}

export default ReservaForm;
