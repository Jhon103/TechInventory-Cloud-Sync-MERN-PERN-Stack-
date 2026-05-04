import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ListaProductos from './pages/ListaProductos';
import FormProducto from './pages/FormProducto';
import EditarProducto from './pages/EditarProducto';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-wrapper">
      {!isLoginPage && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><ListaProductos /></ProtectedRoute>} />
          <Route path="/nuevo" element={<ProtectedRoute><FormProducto /></ProtectedRoute>} />
          <Route path="/editar/:id" element={<ProtectedRoute><EditarProducto /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}