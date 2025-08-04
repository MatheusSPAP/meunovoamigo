const db = require("../db/dbConfig");

class Comentario {
    static async getByPublicacao(publicacao_id) {
        const query = `
            SELECT 
                c.id_comentario, c.fk_idcomunidade, c.fk_idusuario,
                c.mensagem, c.data,
                u.nome as autor_nome
            FROM comentario c
            LEFT JOIN usuario u ON c.fk_idusuario = u.idusuario
            WHERE c.fk_idcomunidade = ?
            ORDER BY c.data ASC
        `;
        return await db.executeQuery(query, [publicacao_id]);
    }

    static async create(fk_idcomunidade, fk_idusuario, mensagem) {
        const publicacaoCheck = await db.executeQuery('SELECT idcomunidade FROM publicacao WHERE idcomunidade = ?', [fk_idcomunidade]);
        if (publicacaoCheck.length === 0) {
            throw new Error('Publicação não encontrada');
        }

        const userCheck = await db.executeQuery('SELECT idusuario FROM usuario WHERE idusuario = ?', [fk_idusuario]);
        if (userCheck.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        const insertQuery = 'INSERT INTO comentario (fk_idcomunidade, fk_idusuario, mensagem, data) VALUES (?, ?, ?, CURDATE())';
        const result = await db.executeQuery(insertQuery, [fk_idcomunidade, fk_idusuario, mensagem]);
        
        const newComentario = await db.executeQuery(`
            SELECT 
                c.id_comentario, c.fk_idcomunidade, c.fk_idusuario,
                c.mensagem, c.data,
                u.nome as autor_nome
            FROM comentario c
            LEFT JOIN usuario u ON c.fk_idusuario = u.idusuario
            WHERE c.id_comentario = ?
        `, [result.insertId]);
        
        return newComentario[0];
    }

    static async delete(id) {
        const checkQuery = 'SELECT id_comentario FROM comentario WHERE id_comentario = ?';
        const existingComentario = await db.executeQuery(checkQuery, [id]);
        if (existingComentario.length === 0) {
            throw new Error('Comentário não encontrado');
        }

        const deleteQuery = 'DELETE FROM comentario WHERE id_comentario = ?';
        await db.executeQuery(deleteQuery, [id]);
        return { message: 'Comentário deletado com sucesso' };
    }

    static async update(id, mensagem) {
        const checkQuery = 'SELECT id_comentario FROM comentario WHERE id_comentario = ?';
        const existingComentario = await db.executeQuery(checkQuery, [id]);
        if (existingComentario.length === 0) {
            throw new Error('Comentário não encontrado');
        }

        const updateQuery = 'UPDATE comentario SET mensagem = ? WHERE id_comentario = ?';
        await db.executeQuery(updateQuery, [mensagem, id]);
        
        const updatedComentario = await db.executeQuery(`
            SELECT 
                c.id_comentario, c.fk_idcomunidade, c.fk_idusuario,
                c.mensagem, c.data,
                u.nome as autor_nome
            FROM comentario c
            LEFT JOIN usuario u ON c.fk_idusuario = u.idusuario
            WHERE c.id_comentario = ?
        `, [id]);
        
        return updatedComentario[0];
    }

    static async getByUsuario(usuarioId) {
        const query = `
            SELECT 
                c.id_comentario, c.fk_idcomunidade, c.fk_idusuario,
                c.mensagem, c.data,
                u.nome as autor_nome,
                p.titulo as publicacao_titulo
            FROM comentario c
            LEFT JOIN usuario u ON c.fk_idusuario = u.idusuario
            LEFT JOIN publicacao p ON c.fk_idcomunidade = p.idcomunidade
            WHERE c.fk_idusuario = ?
            ORDER BY c.data DESC
        `;
        return await db.executeQuery(query, [usuarioId]);
    }
}

module.exports = Comentario;

