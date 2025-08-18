const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Função para testar conexão
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado ao MySQL com sucesso!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao MySQL:', error.message);
        return false;
    }
}

// Função para obter conexão do pool
async function connect() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Erro ao obter conexão:', error);
        throw error;
    }
}

// Função para executar queries
async function executeQuery(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Erro na query:', error);
        throw error;
    }
}

module.exports = {
    pool,
    connect,
    executeQuery,
    testConnection
};

