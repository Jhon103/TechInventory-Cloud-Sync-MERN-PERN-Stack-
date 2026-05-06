const express = require('express');
const cors = require('cors');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./backend/config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/productos', require('./backend/routes/productos'));

app.get('/api', (req, res) => {
  res.json({ mensaje: 'API de Inventario funcionando' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}
