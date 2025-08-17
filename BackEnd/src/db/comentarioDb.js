const db = require('./dbConfig');

class ComentarioDb {

    static async insert(model) {
        const conn = await db.connect();

        const { fk_idcomunidade, fk_idusuario, mensagem, data_comentario } = model;

        const query = 'INSERT INTO comentario (fk_idcomunidade, fk_idusuario, mensagem, data_comentario) VALUES (?, ?, ?, ?)';

        try {
            const [result] = await conn.execute(query, [fk_idcomunidade, fk_idusuario, mensagem, data_comentario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectAll() {
        const conn = await db.connect();

        const query = `SELECT c.*, u.nome as nome_usuario, p.titulo as titulo_postagem
                       FROM comentario c
                       LEFT JOIN usuario u ON c.fk_idusuario = u.idusuario
                       LEFT JOIN postagem p ON c.fk_idcomunidade = p.idcomunidade
                       ORDER BY c.data_comentario DESC`;
        
        try {
            const [result] = await conn.execute(query);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByPostagem(idcomunidade) {
        const conn = await db.connect();

        const query = `SELECT c.*, u.nome as nome_usuario
                       FROM comentario c
                       LEFT JOIN usuario u ON c.fk_idusuario = u.idusuario
                       WHERE c.fk_idcomunidade = ?
                       ORDER BY c.data_comentario ASC`;
        
        try {
            const [result] = await conn.execute(query, [idcomunidade]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByUsuario(idusuario) {
        const conn = await db.connect();

        const query = `SELECT c.*, u.nome as nome_usuario, p.titulo as titulo_postagem
                       FROM comentario c
                       LEFT JOIN usuario u ON c.fk_idusuario = u.idusuario
                       LEFT JOIN postagem p ON c.fk_idcomunidade = p.idcomunidade
                       WHERE c.fk_idusuario = ?
                       ORDER BY c.data_comentario DESC`;
        
        try {
            const [result] = await conn.execute(query, [idusuario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectById(fk_idcomunidade, fk_idusuario, id_comentario) {
        const conn = await db.connect();

        const query = `SELECT c.*, u.nome as nome_usuario, p.titulo as titulo_postagem
                       FROM comentario c
                       LEFT JOIN usuario u ON c.fk_idusuario = u.idusuario
                       LEFT JOIN postagem p ON c.fk_idcomunidade = p.idcomunidade
                       WHERE c.fk_idcomunidade = ? AND c.fk_idusuario = ? AND c.id_comentario = ?`;
        
        try {
            const [result] = await conn.execute(query, [fk_idcomunidade, fk_idusuario, id_comentario]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async update(model) {
        const conn = await db.connect();

        const fk_idcomunidade = model.fk_idcomunidade;
        const fk_idusuario = model.fk_idusuario;
        const id_comentario = model.id_comentario;
        const mensagem = model.mensagem;

        const query = 'UPDATE comentario SET mensagem = ? WHERE fk_idcomunidade = ? AND fk_idusuario = ? AND id_comentario = ?';

        try {
            const [result] = await conn.execute(query, [mensagem, fk_idcomunidade, fk_idusuario, id_comentario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(fk_idcomunidade, fk_idusuario, id_comentario) {
        const conn = await db.connect();

        const query = 'DELETE FROM comentario WHERE fk_idcomunidade = ? AND fk_idusuario = ? AND id_comentario = ?';

        try {
            const [result] = await conn.execute(query, [fk_idcomunidade, fk_idusuario, id_comentario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }
}

module.exports = ComentarioDb;

