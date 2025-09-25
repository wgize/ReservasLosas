import React, { useState } from "react";
import API, { setAuthToken } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import CardContainer from "../components/CardContainer";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
  });
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuthToken(token);
      if (user.rol === "dueno") nav("/owner");
      else nav("/client");
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrar");
    }
  };

  return (
    <CardContainer title="📝 Crear cuenta">
      <form onSubmit={submit} className="form">
        <input
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handle}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handle}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handle}
          required
        />
        <select name="rol" value={form.rol} onChange={handle}>
          <option value="cliente">Cliente</option>
          <option value="dueno">Dueño</option>
        </select>
        <button type="submit">Registrar</button>
      </form>
      <p className="small">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </CardContainer>
  );
}
