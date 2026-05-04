import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const usuario = sessionStorage.getItem('usuario');

  const handleLogout = () => {
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        INVENTARIO<span>.pro</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {usuario && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>👤 {usuario}</span>}
        <Link to="/nuevo" className="nav-btn">
          + Nuevo Producto
        </Link>
        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
          Salir
        </button>
      </div>
    </nav>
  );
}