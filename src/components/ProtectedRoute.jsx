/**
 * Componente ProtectedRoute
 * Protege rutas que requieren autenticación
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Verifica si hay un token guardado
  const token = localStorage.getItem('token');
  
  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;