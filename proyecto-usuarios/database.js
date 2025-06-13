const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // normalmente 'root'
  password: 'b5fbe1eb-d8bd-40af-ba41-c694ebc67e76',
  database: 'webapp_db'
});

connection.connect(error => {
  if (error) throw error;
  console.log('Conectado a la base de datos MySQL');
  
  // Crear tabla si no existe
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  connection.query(createTableQuery, (err) => {
    if (err) throw err;
    console.log('Tabla users verificada/creada');
  });
});

module.exports = connection;