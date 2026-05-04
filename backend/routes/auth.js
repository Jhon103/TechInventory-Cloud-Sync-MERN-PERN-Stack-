const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

let jwt;
try {
  jwt = require('jsonwebtoken');
} catch {
  jwt = null;
}

// POST /api/auth/login
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

    const ok = await bcrypt.compare(password, result.rows[0].password);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    let token = null;
    if (jwt) {
      token = jwt.sign(
        { usuario: result.rows[0].usuario },
        process.env.JWT_SECRET || 'secreto_super_seguro_123',
        { expiresIn: '1h' }
      );
    }

    res.json({ ok: true, usuario: result.rows[0].usuario, token });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
});

module.exports = router;
