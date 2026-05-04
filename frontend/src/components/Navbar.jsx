import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        INVENTARIO<span>.pro</span>
      </Link>
      <Link to="/nuevo" className="nav-btn">
        + Nuevo Producto
      </Link>
    </nav>
  );
}