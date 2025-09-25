// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function getUserFromLocal() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function ProtectedRoute({ role, children }) {
  const user = getUserFromLocal();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.rol !== role) return <Navigate to="/" replace />;
  return children;
}
