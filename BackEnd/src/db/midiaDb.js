const db = require('./dbMysqlConfig');

class MidiaDb {

    static async insert(model) {
        const conn = await db.connect();

        const nome_arquivo = model.nome_arquivo;
        const tipo = model.tipo;
        const tamanho = model.tamanho;
        const caminho = model.caminho;
        const data_upload = model.data_upload;
        const postagem_idcomunidade = model.postagem_idcomunidade;
        const postagem_animal_idAnimal = model.postagem_animal_idAnimal;
        const postagem_usuario_idusuario = model.postagem_usuario_idusuario;

        const query = `INSERT INTO midia (nome_arquivo, tipo, tamanho, caminho, data_upload, 
                       postagem_idcomunidade, postagem_animal_idAnimal, postagem_usuario_idusuario) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        try {
            const [result] = await conn.execute(query, [nome_arquivo, tipo, tamanho, caminho, data_upload, 
                postagem_idcomunidade, postagem_animal_idAnimal, postagem_usuario_idusuario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectAll() {
        const conn = await db.connect();

        const query = `SELECT m.*, p.titulo as titulo_postagem
                       FROM midia m
                       LEFT JOIN postagem p ON m.postagem_idcomunidade = p.idcomunidade
                       ORDER BY m.data_upload DESC`;
        
        try {
            const [result] = await conn.execute(query);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectById(id) {
        const conn = await db.connect();

        const query = `SELECT m.*, p.titulo as titulo_postagem
                       FROM midia m
                       LEFT JOIN postagem p ON m.postagem_idcomunidade = p.idcomunidade
                       WHERE m.idmidia = ?`;
        
        try {
            const [result] = await conn.execute(query, [id]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByPostagem(idcomunidade) {
        const conn = await db.connect();

        const query = `SELECT m.*, p.titulo as titulo_postagem
                       FROM midia m
                       LEFT JOIN postagem p ON m.postagem_idcomunidade = p.idcomunidade
                       WHERE m.postagem_idcomunidade = ?
                       ORDER BY m.data_upload ASC`;
        
        try {
            const [result] = await conn.execute(query, [idcomunidade]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByTipo(tipo) {
        const conn = await db.connect();

        const query = `SELECT m.*, p.titulo as titulo_postagem
                       FROM midia m
                       LEFT JOIN postagem p ON m.postagem_idcomunidade = p.idcomunidade
                       WHERE m.tipo = ?
                       ORDER BY m.data_upload DESC`;
        
        try {
            const [result] = await conn.execute(query, [tipo]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async update(model) {
        const conn = await db.connect();

        const idmidia = model.idmidia;
        const nome_arquivo = model.nome_arquivo;
        const tipo = model.tipo;
        const tamanho = model.tamanho;
        const caminho = model.caminho;

        const query = 'UPDATE midia SET nome_arquivo = ?, tipo = ?, tamanho = ?, caminho = ? WHERE idmidia = ?';

        try {
            const [result] = await conn.execute(query, [nome_arquivo, tipo, tamanho, caminho, idmidia]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM midia WHERE idmidia = ?';

        try {
            const [result] = await conn.execute(query, [id]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }
}

module.exports = MidiaDb;

