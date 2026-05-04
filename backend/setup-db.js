require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function setupDB() {
  try {
    console.log('⏳ Conectando a la base de datos en la nube...');
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ Conexión exitosa. Creando tablas...');

    // Crear tabla credenciales
    await db.query(`
      CREATE TABLE IF NOT EXISTS credenciales (
        USER VARCHAR(50) PRIMARY KEY,
        PASSWORD VARCHAR(255) NOT NULL
      )
    `);

    // Insertar usuario admin por defecto si no existe
    const [existAdmin] = await db.query('SELECT * FROM credenciales WHERE USER = "admin"');
    if (existAdmin.length === 0) {
      const hash = await bcrypt.hash('123456', 10);
      await db.query('INSERT INTO credenciales (USER, PASSWORD) VALUES (?, ?)', ['admin', hash]);
      console.log('✅ Usuario admin creado (admin / 123456)');
    }

    // Crear tabla productos
    await db.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        descripcion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabla productos lista.');
    console.log('🎉 ¡Base de datos inicializada correctamente! Ya puedes cerrar este script.');
    
    await db.end();
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
  }
}

setupDB();
