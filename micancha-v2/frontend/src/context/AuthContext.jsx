import { createContext, useContext, useState, useCallback } from 'react';
import { setAuthToken } from '../utils/api';

const AuthContext = createContext(null);

function leerStorage() {
  try {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    if (token && raw) return { token, user: JSON.parse(raw) };
  } catch {
    /* storage corrupto */
  }
  return null;
}

// Se carga al importar el módulo: el header de Authorization queda listo
// ANTES de que los dashboards hagan su primer fetch (evita 401 en recarga).
const sesionInicial = leerStorage();
if (sesionInicial) setAuthToken(sesionInicial.token);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(sesionInicial);

  const login = useCallback((user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(token);
    setSesion({ user, token });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setSesion(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user: sesion?.user ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
