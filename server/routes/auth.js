const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const result = await db.query(
      'SELECT usuario, password FROM credenciales WHERE usuario = $1',
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const ok = await bcryptjs.compare(password, result.rows[0].password);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { usuario: result.rows[0].usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ ok: true, usuario: result.rows[0].usuario, token });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
});

module.exports = router;
