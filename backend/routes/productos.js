const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const validarProducto = require('../middleware/validarProducto');

// GET /api/productos  — con búsqueda opcional ?q=termino
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let filtro = {};

    if (q) {
      filtro = {
        $or: [
          { nombre: { $regex: q, $options: 'i' } },
          { categoria: { $regex: q, $options: 'i' } },
        ],
      };
    }

    const productos = await Producto.find(filtro).sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});

// POST /api/productos
router.post('/', validarProducto, async (req, res) => {
  try {
    const producto = new Producto(req.body);
    const guardado = await producto.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar producto', error: error.message });
  }
});

// PUT /api/productos/:id
router.put('/:id', validarProducto, async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
});

// DELETE /api/productos/:id
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
});

module.exports = router;