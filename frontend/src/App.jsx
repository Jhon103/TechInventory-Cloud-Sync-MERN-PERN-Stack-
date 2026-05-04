import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ListaProductos from './pages/ListaProductos';
import FormProducto from './pages/FormProducto';
import EditarProducto from './pages/EditarProducto';

export default function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ListaProductos />} />
          <Route path="/nuevo" element={<FormProducto />} />
          <Route path="/editar/:id" element={<EditarProducto />} />
        </Routes>
      </main>
    </div>
  );
}