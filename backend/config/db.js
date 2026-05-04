const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 5432,
});

pool.connect()
  .then(async (client) => {
    console.log('✅ Base de datos PostgreSQL conectada');

    try {
      // 1. Crear tabla credenciales (Borramos la vieja por si tiene columnas en mayúscula)
      await client.query(`DROP TABLE IF EXISTS credenciales`);
      await client.query(`
        CREATE TABLE credenciales (
          usuario VARCHAR(50) PRIMARY KEY,
          password VARCHAR(255) NOT NULL
        )
      `);

      // 2. Insertar admin por defecto si no existe
      const resAdmin = await client.query('SELECT * FROM credenciales WHERE usuario = $1', ['admin']);
      if (resAdmin.rows.length === 0) {
        const hash = await bcrypt.hash('123456', 10);
        await client.query('INSERT INTO credenciales (usuario, password) VALUES ($1, $2)', ['admin', hash]);
        console.log('✅ Usuario admin autogenerado');
      }

      // 3. Crear tabla productos
      await client.query(`
        CREATE TABLE IF NOT EXISTS productos (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          categoria VARCHAR(50) NOT NULL,
          precio DECIMAL(10,2) NOT NULL,
          stock INT NOT NULL DEFAULT 0,
          descripcion TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tablas verificadas/creadas correctamente');
    } catch (err) {
      console.error('❌ Error al inicializar tablas:', err.message);
    } finally {
      client.release();
    }
  })
  .catch(err => {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
  });

module.exports = pool;