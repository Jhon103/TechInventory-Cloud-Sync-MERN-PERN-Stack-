if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('./server/app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
