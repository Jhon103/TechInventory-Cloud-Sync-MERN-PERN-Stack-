import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { crearProducto } from '../api/productos';
import ErrorMsg from '../components/ErrorMsg';

const esquema = Yup.object({
  nombre: Yup.string().required('Requerido').min(2, 'Mínimo 2 caracteres'),
  categoria: Yup.string().required('Requerido'),
  precio: Yup.number().typeError('Debe ser un número').required('Requerido').min(0, 'No negativo'),
  stock: Yup.number().typeError('Debe ser un número').required('Requerido').min(0, 'No negativo'),
  descripcion: Yup.string(),
});

export default function FormProducto() {
  const navigate = useNavigate();
  const [errorRed, setErrorRed] = useState('');

  const formik = useFormik({
    initialValues: { nombre: '', categoria: '', precio: '', stock: '', descripcion: '' },
    validationSchema: esquema,
    onSubmit: async (valores, { setSubmitting }) => {
      try {
        setErrorRed('');
        await crearProducto(valores);
        navigate('/');
      } catch (err) {
        const msg = err.response?.data?.errores?.join(', ') ||
          err.response?.data?.mensaje ||
          'Error al guardar. Verifica el servidor.';
        setErrorRed(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <div className="form-card">
        <h2 className="form-title">Nuevo <span>Producto</span></h2>
        {errorRed && <ErrorMsg mensaje={errorRed} />}
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input name="nombre" value={formik.values.nombre}
              onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.nombre && formik.errors.nombre && (
              <p className="error-field">{formik.errors.nombre}</p>
            )}
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <input name="categoria" value={formik.values.categoria}
              onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.categoria && formik.errors.categoria && (
              <p className="error-field">{formik.errors.categoria}</p>
            )}
          </div>
          <div className="form-group">
            <label>Precio (S/)</label>
            <input type="number" name="precio" value={formik.values.precio}
              onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.precio && formik.errors.precio && (
              <p className="error-field">{formik.errors.precio}</p>
            )}
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" name="stock" value={formik.values.stock}
              onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.stock && formik.errors.stock && (
              <p className="error-field">{formik.errors.stock}</p>
            )}
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={formik.values.descripcion}
              onChange={formik.handleChange} placeholder="Opcional..." />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </button>
            <Link to="/" className="btn-secondary">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}