import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const estaAutenticado = sessionStorage.getItem('usuario') !== null;

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
