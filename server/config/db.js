const { Pool } = require('pg');
const bcryptjs = require('bcryptjs');

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('POSTGRES_URL/DATABASE_URL no definida. Configura la variable de entorno.');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

let initialized = false;

async function initializeDatabase() {
  if (initialized) return;
  
  let client;
  try {
    client = await pool.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS credenciales (
        usuario VARCHAR(50) PRIMARY KEY,
        password VARCHAR(255) NOT NULL
      )
    `);

    const hash = await bcryptjs.hash('123456', 10);
    await client.query(
      'INSERT INTO credenciales (usuario, password) VALUES ($1, $2) ON CONFLICT (usuario) DO NOTHING',
      ['admin', hash]
    );

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

    initialized = true;
    console.log('Tablas verificadas/creadas correctamente');
  } catch (err) {
    console.error('Error al inicializar tablas:', err.message);
  } finally {
    if (client) client.release();
  }
}

initializeDatabase();

module.exports = pool;
