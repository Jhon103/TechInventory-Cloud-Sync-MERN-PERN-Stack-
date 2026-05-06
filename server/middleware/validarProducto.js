const yup = require('yup');

const esquema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'Mínimo 2 caracteres'),
  categoria: yup
    .string()
    .required('La categoría es obligatoria'),
  precio: yup
    .number()
    .typeError('El precio debe ser un número')
    .required('El precio es obligatorio')
    .min(0, 'El precio no puede ser negativo'),
  stock: yup
    .number()
    .typeError('El stock debe ser un número')
    .required('El stock es obligatorio')
    .min(0, 'El stock no puede ser negativo'),
  descripcion: yup.string().optional(),
});

const validarProducto = async (req, res, next) => {
  try {
    await esquema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Datos inválidos',
      errores: error.errors,
    });
  }
};

module.exports = validarProducto;