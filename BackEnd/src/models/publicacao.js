const db = require("../db/dbConfig");

class Publicacao {
    static async getAll() {
        const query = `
            SELECT 
                p.idcomunidade, p.titulo, p.descricao, p.data,
                p.animal_idAnimal, p.usuario_idusuario,
                u.nome as autor_nome,
                a.nome as animal_nome, a.raca as animal_raca
            FROM publicacao p
            LEFT JOIN usuario u ON p.usuario_idusuario = u.idusuario
            LEFT JOIN animal a ON p.animal_idAnimal = a.idAnimal
            ORDER BY p.data DESC
        `;
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = `
            SELECT 
                p.idcomunidade, p.titulo, p.descricao, p.data,
                p.animal_idAnimal, p.usuario_idusuario,
                u.nome as autor_nome,
                a.nome as animal_nome, a.raca as animal_raca
            FROM publicacao p
            LEFT JOIN usuario u ON p.usuario_idusuario = u.idusuario
            LEFT JOIN animal a ON p.animal_idAnimal = a.idAnimal
            WHERE p.idcomunidade = ?
        `;
        const publicacoes = await db.executeQuery(query, [id]);
        return publicacoes.length > 0 ? publicacoes[0] : null;
    }

    static async create(titulo, descricao, animal_idAnimal, usuario_idusuario) {
        const userCheck = await db.executeQuery('SELECT idusuario FROM usuario WHERE idusuario = ?', [usuario_idusuario]);
        if (userCheck.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        const animalCheck = await db.executeQuery('SELECT idAnimal FROM animal WHERE idAnimal = ?', [animal_idAnimal]);
        if (animalCheck.length === 0) {
            throw new Error('Animal não encontrado');
        }

        const insertQuery = 'INSERT INTO publicacao (titulo, descricao, data, animal_idAnimal, usuario_idusuario) VALUES (?, ?, CURDATE(), ?, ?)';
        const result = await db.executeQuery(insertQuery, [titulo, descricao, animal_idAnimal, usuario_idusuario]);
        return this.getById(result.insertId);
    }

    static async update(id, titulo, descricao) {
        const checkQuery = 'SELECT idcomunidade FROM publicacao WHERE idcomunidade = ?';
        const existingPublicacao = await db.executeQuery(checkQuery, [id]);
        if (existingPublicacao.length === 0) {
            throw new Error('Publicação não encontrada');
        }

        const updates = [];
        const values = [];
        if (titulo) { updates.push('titulo = ?'); values.push(titulo); }
        if (descricao) { updates.push('descricao = ?'); values.push(descricao); }

        if (updates.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        values.push(id);
        const updateQuery = `UPDATE publicacao SET ${updates.join(', ')} WHERE idcomunidade = ?`;
        await db.executeQuery(updateQuery, values);
        return this.getById(id);
    }

    static async delete(id) {
        const checkQuery = 'SELECT idcomunidade FROM publicacao WHERE idcomunidade = ?';
        const existingPublicacao = await db.executeQuery(checkQuery, [id]);
        if (existingPublicacao.length === 0) {
            throw new Error('Publicação não encontrada');
        }

        await db.executeQuery('DELETE FROM comentario WHERE fk_idcomunidade = ?', [id]);
        await db.executeQuery('DELETE FROM midia WHERE postagem_idcomunidade = ?', [id]);

        const deleteQuery = 'DELETE FROM publicacao WHERE idcomunidade = ?';
        await db.executeQuery(deleteQuery, [id]);
        return { message: 'Publicação deletada com sucesso' };
    }

    static async getByUsuario(usuarioId) {
        const query = `
            SELECT 
                p.idcomunidade, p.titulo, p.descricao, p.data,
                p.animal_idAnimal, p.usuario_idusuario,
                u.nome as autor_nome,
                a.nome as animal_nome, a.raca as animal_raca
            FROM publicacao p
            LEFT JOIN usuario u ON p.usuario_idusuario = u.idusuario
            LEFT JOIN animal a ON p.animal_idAnimal = a.idAnimal
            WHERE p.usuario_idusuario = ?
            ORDER BY p.data DESC
        `;
        return await db.executeQuery(query, [usuarioId]);
    }

    static async getByAnimal(animalId) {
        const query = `
            SELECT 
                p.idcomunidade, p.titulo, p.descricao, p.data,
                p.animal_idAnimal, p.usuario_idusuario,
                u.nome as autor_nome,
                a.nome as animal_nome, a.raca as animal_raca
            FROM publicacao p
            LEFT JOIN usuario u ON p.usuario_idusuario = u.idusuario
            LEFT JOIN animal a ON p.animal_idAnimal = a.idAnimal
            WHERE p.animal_idAnimal = ?
            ORDER BY p.data DESC
        `;
        return await db.executeQuery(query, [animalId]);
    }
}

module.exports = Publicacao;

