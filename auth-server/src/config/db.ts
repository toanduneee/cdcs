import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // Docker sẽ tự truyền biến này
    user: process.env.DB_USER || 'security_user',
    password: process.env.DB_PASSWORD || 'user_password_123',
    database: process.env.DB_NAME || 'identity_provider_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});