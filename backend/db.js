const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'usuariosDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;


