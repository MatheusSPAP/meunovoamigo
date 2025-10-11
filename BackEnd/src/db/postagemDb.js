const db = require('./dbConfig');

class PostagemDb {

    static async insert(model, connection = null) {
        const newConnection = !connection;
        const conn = newConnection ? await db.connect() : connection;

        const descricao = model.descricao;
        const data_postagem = model.data_postagem;
        const titulo = model.titulo;
        const animal_idAnimal = model.animal_idAnimal;
        const usuario_idusuario = model.usuario_idusuario;

        const query = 'INSERT INTO postagem (descricao, data_postagem, titulo, animal_idAnimal, usuario_idusuario) VALUES (?, ?, ?, ?, ?)';

        try {
            const [result] = await conn.execute(query, [descricao, data_postagem, titulo, animal_idAnimal, usuario_idusuario]);
            if (newConnection) conn.release();
            return result;
        } catch (error) {
            if (newConnection) conn.release();
            throw error;
        }
    }

    static async selectAll() {
        const conn = await db.connect();

        const query = `SELECT p.*, u.nome as nome_usuario, a.nome as nome_animal, a.foto as foto_animal,
                              (SELECT m.caminho FROM midia m WHERE m.postagem_idcomunidade = p.idcomunidade ORDER BY m.idmidia LIMIT 1) as imagem_post
                       FROM postagem p
                       LEFT JOIN usuario u ON p.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON p.animal_idAnimal = a.idAnimal
                       ORDER BY p.data_postagem DESC`;
        
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

        const query = `SELECT p.*, u.nome as nome_usuario, a.nome as nome_animal, a.foto as foto_animal
                       FROM postagem p
                       LEFT JOIN usuario u ON p.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON p.animal_idAnimal = a.idAnimal
                       WHERE p.idcomunidade = ?`;
        
        try {
            const [result] = await conn.execute(query, [id]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByUsuario(idusuario) {
        const conn = await db.connect();

        const query = `SELECT p.*, u.nome as nome_usuario, a.nome as nome_animal, a.foto as foto_animal
                       FROM postagem p
                       LEFT JOIN usuario u ON p.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON p.animal_idAnimal = a.idAnimal
                       WHERE p.usuario_idusuario = ?
                       ORDER BY p.data_postagem DESC`;
        
        try {
            const [result] = await conn.execute(query, [idusuario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByAnimal(idAnimal) {
        const conn = await db.connect();

        const query = `SELECT p.*, u.nome as nome_usuario, a.nome as nome_animal, a.foto as foto_animal
                       FROM postagem p
                       LEFT JOIN usuario u ON p.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON p.animal_idAnimal = a.idAnimal
                       WHERE p.animal_idAnimal = ?
                       ORDER BY p.data_postagem DESC`;
        
        try {
            const [result] = await conn.execute(query, [idAnimal]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async update(model) {
        const conn = await db.connect();

        const idcomunidade = model.idcomunidade;
        const descricao = model.descricao;
        const titulo = model.titulo;

        const query = 'UPDATE postagem SET descricao = ?, titulo = ? WHERE idcomunidade = ?';

        try {
            const [result] = await conn.execute(query, [descricao, titulo, idcomunidade]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM postagem WHERE idcomunidade = ?';

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

module.exports = PostagemDb;

