const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "tius",
    database: process.env.DB_NAME || "modelagemanimaisadocao",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Função para testar conexão
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Conectado ao MySQL com sucesso!");
        connection.release();
        return true;
    } catch (error) {
        console.error("❌ Erro ao conectar ao MySQL:", error.message);
        return false;
    }
}

// Função para executar queries
async function executeQuery(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error("Erro na query:", error);
        throw error;
    }
}

// Função para criar as tabelas se não existirem
async function createTables() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS tipo_animal (
            idtipo INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(45) NOT NULL,
            PRIMARY KEY (idtipo),
            UNIQUE INDEX nome_UNIQUE (nome ASC)
        ) ENGINE = InnoDB;`,

        `CREATE TABLE IF NOT EXISTS raca (
            idraca INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(45) NOT NULL,
            fk_idtipo INT NOT NULL,
            PRIMARY KEY (idraca),
            INDEX fk_raca_tipo_idx (fk_idtipo ASC),
            CONSTRAINT fk_raca_tipo
                FOREIGN KEY (fk_idtipo)
                REFERENCES tipo_animal (idtipo)
                ON DELETE RESTRICT
                ON UPDATE CASCADE
        ) ENGINE = InnoDB;`,

        `CREATE TABLE IF NOT EXISTS status (
            idstatus INT NOT NULL AUTO_INCREMENT,
            tipo VARCHAR(45) NOT NULL,
            PRIMARY KEY (idstatus)
        ) ENGINE = InnoDB;`,

        `CREATE TABLE IF NOT EXISTS usuario (
            idusuario INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(45) NOT NULL,
            email VARCHAR(45) NOT NULL,
            cpf VARCHAR(11) NOT NULL,
            senha VARCHAR(255) NOT NULL,
            cidade VARCHAR(45) NOT NULL,
            endereco VARCHAR(45) NOT NULL,
            data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (idusuario),
            UNIQUE INDEX email_UNIQUE (email ASC),
            UNIQUE INDEX cpf_UNIQUE (cpf ASC)
        ) ENGINE = InnoDB;`,

        `CREATE TABLE IF NOT EXISTS animal (
            idAnimal INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(45) NOT NULL,
            raca VARCHAR(45) NOT NULL,
            foto VARCHAR(45) NOT NULL,
            descricao VARCHAR(45) NOT NULL,
            latitude DECIMAL(10,8) NOT NULL,
            longitude DECIMAL(11,8) NOT NULL,
            data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            fk_idraca INT NOT NULL,
            fk_idusuario INT NOT NULL,
            fk_idstatus INT NOT NULL,
            PRIMARY KEY (idAnimal, fk_idusuario, fk_idstatus),
            INDEX fk_animal_usuario1_idx (fk_idusuario ASC),
            INDEX fk_animal_status1_idx (fk_idstatus ASC),
            INDEX fk_animal_raca_idx (fk_idraca ASC),
            CONSTRAINT fk_animal_raca
                FOREIGN KEY (fk_idraca)
                REFERENCES raca (idraca)
                ON DELETE RESTRICT
                ON UPDATE CASCADE,
            CONSTRAINT fk_animal_status1
                FOREIGN KEY (fk_idstatus)
                REFERENCES status (idstatus),
            CONSTRAINT fk_animal_usuario1
                FOREIGN KEY (fk_idusuario)
                REFERENCES usuario (idusuario)
        ) ENGINE = InnoDB;`,

        `CREATE TABLE IF NOT EXISTS publicacao (
            idcomunidade INT NOT NULL AUTO_INCREMENT,
            titulo VARCHAR(45) NOT NULL,
            descricao VARCHAR(45) NOT NULL,
            data DATE NOT NULL,
            animal_idAnimal INT NOT NULL,
            usuario_idusuario INT NOT NULL,
            PRIMARY KEY (idcomunidade, animal_idAnimal, usuario_idusuario),
            INDEX fk_postagem_animal1_idx (animal_idAnimal ASC),
            INDEX fk_postagem_usuario1_idx (usuario_idusuario ASC),
            CONSTRAINT fk_postagem_animal1
                FOREIGN KEY (animal_idAnimal)
                REFERENCES animal (idAnimal),
            CONSTRAINT fk_postagem_usuario1
                FOREIGN KEY (usuario_idusuario)
                REFERENCES usuario (idusuario)
        ) ENGINE = InnoDB;`,

        `CREATE TABLE IF NOT EXISTS comentario (
            id_comentario INT NOT NULL AUTO_INCREMENT,
            mensagem VARCHAR(255) NOT NULL,
            data DATE NOT NULL,
            fk_idcomunidade INT NOT NULL,
            fk_idusuario INT NOT NULL,
            PRIMARY KEY (id_comentario, fk_idcomunidade, fk_idusuario),
            INDEX fk_comunidade_has_usuario_usuario1_idx (fk_idusuario ASC),
            INDEX fk_comunidade_has_usuario_comunidade1_idx (fk_idcomunidade ASC),
            CONSTRAINT fk_comunidade_has_usuario_comunidade1
                FOREIGN KEY (fk_idcomunidade)
                REFERENCES publicacao (idcomunidade),
            CONSTRAINT fk_comunidade_has_usuario_usuario1
                FOREIGN KEY (fk_idusuario)
                REFERENCES usuario (idusuario)
        ) ENGINE = InnoDB;`,

        `CREATE TABLE IF NOT EXISTS evento (
            idEvento INT NOT NULL AUTO_INCREMENT,
            titulo VARCHAR(45) NOT NULL,
            tipo_evento VARCHAR(45) NOT NULL,
            data DATETIME NOT NULL,
            endereco VARCHAR(45) NOT NULL,
            descricao VARCHAR(45) NOT NULL,
            fk_idusuario INT NOT NULL,
            PRIMARY KEY (idEvento, fk_idusuario),
            INDEX fk_evento_usuario1_idx (fk_idusuario ASC),
            CONSTRAINT fk_evento_usuario1
                FOREIGN KEY (fk_idusuario)
                REFERENCES usuario (idusuario)
        ) ENGINE = InnoDB;`,

        `CREATE TABLE IF NOT EXISTS midia (
            idmidia INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(45) NOT NULL,
            tamanho INT NOT NULL,
            postagem_idcomunidade INT NOT NULL,
            postagem_animal_idAnimal INT NOT NULL,
            postagem_usuario_idusuario INT NOT NULL,
            PRIMARY KEY (idmidia, postagem_idcomunidade, postagem_animal_idAnimal, postagem_usuario_idusuario),
            INDEX fk_midia_postagem1_idx (postagem_idcomunidade ASC, postagem_animal_idAnimal ASC, postagem_usuario_idusuario ASC),
            CONSTRAINT fk_midia_postagem1
                FOREIGN KEY (postagem_idcomunidade , postagem_animal_idAnimal , postagem_usuario_idusuario)
                REFERENCES publicacao (idcomunidade , animal_idAnimal , usuario_idusuario)
        ) ENGINE = InnoDB;`
    ];

    try {
        for (const query of queries) {
            await executeQuery(query);
        }
        console.log("✅ Tabelas criadas/verificadas com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar tabelas:", error);
    }
}

module.exports = {
    pool,
    executeQuery,
    testConnection,
    createTables
};

