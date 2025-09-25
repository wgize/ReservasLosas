import React, { useState } from "react";
import API, { setAuthToken } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import CardContainer from "../components/CardContainer";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuthToken(token);
      if (user.rol === "dueno") nav("/owner");
      else if (user.rol === "admin") nav("/admin");
      else nav("/client");
    } catch (err) {
      alert(err.response?.data?.message || "Credenciales inválidas");
    }
  };

  return (
    <CardContainer title="🔑 Iniciar sesión">
      <form onSubmit={submit} className="form">
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
        <button type="submit">Ingresar</button>
      </form>
      <p className="small">
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </CardContainer>
  );
}
