const express = require('express');
const cors = require('cors');

require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));

app.get('/api', (req, res) => {
  res.json({ mensaje: 'API de Inventario funcionando' });
});

module.exports = app;
