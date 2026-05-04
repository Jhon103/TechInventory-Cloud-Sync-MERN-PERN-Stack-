import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useFormik } from 'formik';
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
  const [errorRed, setErrorRed] = useState('');

  const formik = useFormik({
    initialValues: { nombre: '', categoria: '', precio: '', stock: '', descripcion: '' },
    validationSchema: esquema,
    enableReinitialize: true,
    onSubmit: async (valores, { setSubmitting }) => {
      try {
        setErrorRed('');
        await actualizarProducto(id, valores);
        navigate('/');
      } catch (err) {
        const msg = err.response?.data?.errores?.join(', ') ||
          err.response?.data?.mensaje ||
          'Error al actualizar.';
        setErrorRed(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    getProductoById(id)
      .then(({ data }) => {
        formik.setValues({
          nombre: data.nombre,
          categoria: data.categoria,
          precio: data.precio,
          stock: data.stock,
          descripcion: data.descripcion || '',
        });
      })
      .catch(() => setErrorRed('No se pudo cargar el producto.'))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <Spinner />;

  return (
    <div>
      <div className="form-card">
        <h2 className="form-title">Editar <span>Producto</span></h2>
        {errorRed && <ErrorMsg mensaje={errorRed} />}
        <form onSubmit={formik.handleSubmit}>
          {['nombre', 'categoria'].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched[field] && formik.errors[field] && (
                <p className="error-field">{formik.errors[field]}</p>
              )}
            </div>
          ))}
          {['precio', 'stock'].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="number"
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched[field] && formik.errors[field] && (
                <p className="error-field">{formik.errors[field]}</p>
              )}
            </div>
          ))}
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Actualizando...' : 'Actualizar Producto'}
            </button>
            <Link to="/" className="btn-secondary">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}