const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'tius',
    database: process.env.DB_NAME || 'modelagemanimaisadocao',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// aqui eu coloquei função para testar conexão
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

// Função para criar as tabelas se não existirem
async function createTables() {
    const queries = [
        // Tabela usuario
        `CREATE TABLE IF NOT EXISTS usuario (
            idusuario INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(45) NOT NULL,
            email VARCHAR(45) NOT NULL UNIQUE,
            senha VARCHAR(45) NOT NULL,
            cidade VARCHAR(45) NOT NULL,
            endereco VARCHAR(45) NOT NULL,
            PRIMARY KEY (idusuario)
        ) ENGINE = InnoDB;`,

        // Tabela status
        `CREATE TABLE IF NOT EXISTS status (
            idstatus INT NOT NULL AUTO_INCREMENT,
            tipo VARCHAR(45) NOT NULL,
            PRIMARY KEY (idstatus)
        ) ENGINE = InnoDB;`,

        // Tabela animal
        `CREATE TABLE IF NOT EXISTS animal (
            idAnimal INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(45) NOT NULL,
            raca VARCHAR(45) NOT NULL,
            foto VARCHAR(45) NOT NULL,
            descricao VARCHAR(45) NOT NULL,
            fk_idusuario INT NOT NULL,
            fk_idstatus INT NOT NULL,
            PRIMARY KEY (idAnimal),
            INDEX fk_animal_usuario1_idx (fk_idusuario ASC),
            INDEX fk_animal_status1_idx (fk_idstatus ASC),
            CONSTRAINT fk_animal_usuario1
                FOREIGN KEY (fk_idusuario)
                REFERENCES usuario (idusuario)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION,
            CONSTRAINT fk_animal_status1
                FOREIGN KEY (fk_idstatus)
                REFERENCES status (idstatus)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION
        ) ENGINE = InnoDB;`,

        // Tabela evento
        `CREATE TABLE IF NOT EXISTS evento (
            idEvento INT NOT NULL AUTO_INCREMENT,
            tipo_evento VARCHAR(45) NOT NULL,
            data DATETIME NOT NULL,
            endereco VARCHAR(45) NOT NULL,
            descricao VARCHAR(45) NOT NULL,
            fk_idusuario INT NOT NULL,
            PRIMARY KEY (idEvento),
            INDEX fk_evento_usuario1_idx (fk_idusuario ASC),
            CONSTRAINT fk_evento_usuario1
                FOREIGN KEY (fk_idusuario)
                REFERENCES usuario (idusuario)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION
        ) ENGINE = InnoDB;`,

        // Tabela postagem
        `CREATE TABLE IF NOT EXISTS postagem (
            idcomunidade INT NOT NULL AUTO_INCREMENT,
            descricao VARCHAR(45) NOT NULL,
            comunidadecol VARCHAR(45) NOT NULL,
            data DATE NOT NULL,
            titulo VARCHAR(45) NOT NULL,
            animal_idAnimal INT NOT NULL,
            usuario_idusuario INT NOT NULL,
            PRIMARY KEY (idcomunidade),
            INDEX fk_postagem_animal1_idx (animal_idAnimal ASC),
            INDEX fk_postagem_usuario1_idx (usuario_idusuario ASC),
            CONSTRAINT fk_postagem_animal1
                FOREIGN KEY (animal_idAnimal)
                REFERENCES animal (idAnimal)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION,
            CONSTRAINT fk_postagem_usuario1
                FOREIGN KEY (usuario_idusuario)
                REFERENCES usuario (idusuario)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION
        ) ENGINE = InnoDB;`,

        // Tabela comentario
        `CREATE TABLE IF NOT EXISTS comentario (
            id_comentario INT NOT NULL AUTO_INCREMENT,
            fk_idcomunidade INT NOT NULL,
            fk_idusuario INT NOT NULL,
            mensagem VARCHAR(255) NOT NULL,
            data DATE NOT NULL,
            PRIMARY KEY (id_comentario),
            INDEX fk_comentario_postagem1_idx (fk_idcomunidade ASC),
            INDEX fk_comentario_usuario1_idx (fk_idusuario ASC),
            CONSTRAINT fk_comentario_postagem1
                FOREIGN KEY (fk_idcomunidade)
                REFERENCES postagem (idcomunidade)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION,
            CONSTRAINT fk_comentario_usuario1
                FOREIGN KEY (fk_idusuario)
                REFERENCES usuario (idusuario)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION
        ) ENGINE = InnoDB;`,

        // Tabela midia
        `CREATE TABLE IF NOT EXISTS midia (
            idmidia INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(45) NOT NULL,
            tamanho INT NOT NULL,
            postagem_idcomunidade INT NOT NULL,
            postagem_animal_idAnimal INT NOT NULL,
            postagem_usuario_idusuario INT NOT NULL,
            PRIMARY KEY (idmidia),
            INDEX fk_midia_postagem1_idx (postagem_idcomunidade ASC),
            CONSTRAINT fk_midia_postagem1
                FOREIGN KEY (postagem_idcomunidade)
                REFERENCES postagem (idcomunidade)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION
        ) ENGINE = InnoDB;`
    ];

    try {
        for (const query of queries) {
            await executeQuery(query);
        }
        console.log('✅ Tabelas criadas/verificadas com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao criar tabelas:', error);
    }
}

module.exports = {
    pool,
    executeQuery,
    testConnection,
    createTables
};

