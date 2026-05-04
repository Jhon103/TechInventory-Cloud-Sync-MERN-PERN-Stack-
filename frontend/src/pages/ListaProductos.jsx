import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProductos, eliminarProducto } from '../api/productos';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [query, setQuery] = useState('');

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError('');
      const { data } = await getProductos(query);
      setProductos(data);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  }, [query]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setQuery(busqueda.trim());
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await eliminarProducto(id);
      setProductos((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Error al eliminar el producto.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Stock <span>Actual</span></h1>
        <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            className="search-box"
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit" className="nav-btn">Buscar</button>
          {query && (
            <button type="button" className="btn-secondary"
              onClick={() => { setBusqueda(''); setQuery(''); }}>
              ✕
            </button>
          )}
        </form>
      </div>
      {error && <ErrorMsg mensaje={error} />}
      {cargando ? (
        <Spinner />
      ) : productos.length === 0 ? (
        <p className="empty-state">No se encontraron productos.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p._id}>
                  <td>{p.nombre}</td>
                  <td><span className="badge">{p.categoria}</span></td>
                  <td>S/ {Number(p.precio).toFixed(2)}</td>
                  <td className={p.stock <= 5 ? 'stock-low' : 'stock-ok'}>{p.stock}</td>
                  <td>
                    <Link to={`/editar/${p._id}`} className="btn-icon">✏ Editar</Link>
                    <button className="btn-icon danger" onClick={() => handleEliminar(p._id)}>✕ Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}