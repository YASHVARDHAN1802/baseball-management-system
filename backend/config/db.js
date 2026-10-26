const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,      // <-- ADD THIS LINE to read your env port!
    user: process.env.DB_USER || 'root',      // Uses env variables with hardcoded fallbacks
    password: process.env.DB_PASSWORD || 'root',  
    database: process.env.DB_NAME || 'baseball_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();