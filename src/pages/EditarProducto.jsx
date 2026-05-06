import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { getProductoById, actualizarProducto } from '../api/productos';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';

const esquema = Yup.object({
  nombre: Yup.string().required('Requerido').min(2, 'Mínimo 2 caracteres'),
  categoria: Yup.string().required('Requerido'),
  precio: Yup.number().typeError('Debe ser un número').required('Requerido').min(0, 'No negativo'),
  stock: Yup.number().typeError('Debe ser un número').required('Requerido').min(0, 'No negativo'),
  descripcion: Yup.string(),
});

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorRed, setErrorRed] = useState('');
  const [valores, setValores] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    descripcion: '',
  });

  useEffect(() => {
    let activo = true;
    getProductoById(id)
      .then(({ data }) => {
        if (!activo) return;
        setValores({
          nombre: data.nombre || '',
          categoria: data.categoria || '',
          precio: data.precio ?? '',
          stock: data.stock ?? '',
          descripcion: data.descripcion || '',
        });
      })
      .catch(() => {
        if (activo) setErrorRed('No se pudo cargar el producto.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => { activo = false; };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorRed('');
    try {
      await esquema.validate(valores, { abortEarly: false });
    } catch (err) {
      const mapa = {};
      err.inner.forEach((e) => { mapa[e.path] = e.message; });
      setErrores(mapa);
      return;
    }
    setEnviando(true);
    try {
      await actualizarProducto(id, valores);
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.errores?.join(', ') ||
        err.response?.data?.mensaje ||
        'Error al actualizar.';
      setErrorRed(msg);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <Spinner />;

  return (
    <div>
      <div className="form-card">
        <h2 className="form-title">Editar <span>Producto</span></h2>
        {errorRed && <ErrorMsg mensaje={errorRed} />}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input name="nombre" value={valores.nombre} onChange={handleChange} />
            {errores.nombre && <p className="error-field">{errores.nombre}</p>}
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <input name="categoria" value={valores.categoria} onChange={handleChange} />
            {errores.categoria && <p className="error-field">{errores.categoria}</p>}
          </div>
          <div className="form-group">
            <label>Precio (S/)</label>
            <input type="number" name="precio" value={valores.precio} onChange={handleChange} />
            {errores.precio && <p className="error-field">{errores.precio}</p>}
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" name="stock" value={valores.stock} onChange={handleChange} />
            {errores.stock && <p className="error-field">{errores.stock}</p>}
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={valores.descripcion} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={enviando}>
              {enviando ? 'Actualizando...' : 'Actualizar Producto'}
            </button>
            <Link to="/" className="btn-secondary">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}