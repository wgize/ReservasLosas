const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'reservas_db'
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    return;
  }
  console.log('✅ Conexión exitosa a MySQL');
  connection.end();
});
