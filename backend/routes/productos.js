const express = require('express');
const router = express.Router();
const db = require('../config/db');
const validarProducto = require('../middleware/validarProducto');

// GET /api/productos
router.get('/', async (req, res) => {
  try {
    const { q, categoria } = req.query;
    let query = 'SELECT * FROM productos WHERE 1=1';
    const args = [];
    let paramIndex = 1;

    if (q) {
      query += ` AND (nombre ILIKE $${paramIndex} OR descripcion ILIKE $${paramIndex + 1})`;
      args.push(`%${q}%`, `%${q}%`);
      paramIndex += 2;
    }
    if (categoria && categoria !== 'Todas') {
      query += ` AND categoria = $${paramIndex}`;
      args.push(categoria);
      paramIndex++;
    }
    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, args);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
  }
});

// POST /api/productos
router.post('/', validarProducto, async (req, res) => {
  try {
    const { nombre, categoria, precio, stock, descripcion } = req.body;
    const result = await db.query(
      'INSERT INTO productos (nombre, categoria, precio, stock, descripcion) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nombre, categoria, Number(precio), Number(stock), descripcion || '']
    );
    res.status(201).json({ id: result.rows[0].id, nombre, categoria, precio, stock, descripcion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar producto', error: error.message });
  }
});

// PUT /api/productos/:id
router.put('/:id', validarProducto, async (req, res) => {
  try {
    const { nombre, categoria, precio, stock, descripcion } = req.body;
    const result = await db.query(
      'UPDATE productos SET nombre=$1, categoria=$2, precio=$3, stock=$4, descripcion=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6',
      [nombre, categoria, Number(precio), Number(stock), descripcion || '', req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ id: req.params.id, nombre, categoria, precio, stock, descripcion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
});

// DELETE /api/productos/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM productos WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
});

module.exports = router;