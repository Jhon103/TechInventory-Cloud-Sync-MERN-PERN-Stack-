const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Inventario funcionando ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});