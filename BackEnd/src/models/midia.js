const db = require("../db/dbConfig");

class Midia {
    static async getAll() {
        const query = `
            SELECT 
                m.idmidia, m.nome, m.tamanho,
                m.postagem_idcomunidade, m.postagem_animal_idAnimal, m.postagem_usuario_idusuario,
                p.titulo as publicacao_titulo
            FROM midia m
            LEFT JOIN publicacao p ON m.postagem_idcomunidade = p.idcomunidade
        `;
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = `
            SELECT 
                m.idmidia, m.nome, m.tamanho,
                m.postagem_idcomunidade, m.postagem_animal_idAnimal, m.postagem_usuario_idusuario,
                p.titulo as publicacao_titulo
            FROM midia m
            LEFT JOIN publicacao p ON m.postagem_idcomunidade = p.idcomunidade
            WHERE m.idmidia = ?
        `;
        const midias = await db.executeQuery(query, [id]);
        return midias.length > 0 ? midias[0] : null;
    }

    static async getByPublicacao(publicacaoId) {
        const query = `
            SELECT 
                m.idmidia, m.nome, m.tamanho,
                m.postagem_idcomunidade, m.postagem_animal_idAnimal, m.postagem_usuario_idusuario,
                p.titulo as publicacao_titulo
            FROM midia m
            LEFT JOIN publicacao p ON m.postagem_idcomunidade = p.idcomunidade
            WHERE m.postagem_idcomunidade = ?
        `;
        return await db.executeQuery(query, [publicacaoId]);
    }

    static async create(nome, tamanho, postagem_idcomunidade, postagem_animal_idAnimal, postagem_usuario_idusuario) {
        const publicacaoCheck = await db.executeQuery(
            'SELECT idcomunidade FROM publicacao WHERE idcomunidade = ? AND animal_idAnimal = ? AND usuario_idusuario = ?', 
            [postagem_idcomunidade, postagem_animal_idAnimal, postagem_usuario_idusuario]
        );
        if (publicacaoCheck.length === 0) {
            throw new Error('Publicação não encontrada');
        }

        const insertQuery = 'INSERT INTO midia (nome, tamanho, postagem_idcomunidade, postagem_animal_idAnimal, postagem_usuario_idusuario) VALUES (?, ?, ?, ?, ?)';
        const result = await db.executeQuery(insertQuery, [nome, tamanho, postagem_idcomunidade, postagem_animal_idAnimal, postagem_usuario_idusuario]);
        return this.getById(result.insertId);
    }

    static async update(id, nome, tamanho) {
        const checkQuery = 'SELECT idmidia FROM midia WHERE idmidia = ?';
        const existingMidia = await db.executeQuery(checkQuery, [id]);
        if (existingMidia.length === 0) {
            throw new Error('Mídia não encontrada');
        }

        const updates = [];
        const values = [];
        if (nome) { updates.push('nome = ?'); values.push(nome); }
        if (tamanho !== undefined) { updates.push('tamanho = ?'); values.push(tamanho); }

        if (updates.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        values.push(id);
        const updateQuery = `UPDATE midia SET ${updates.join(', ')} WHERE idmidia = ?`;
        await db.executeQuery(updateQuery, values);
        return this.getById(id);
    }

    static async delete(id) {
        const checkQuery = 'SELECT idmidia FROM midia WHERE idmidia = ?';
        const existingMidia = await db.executeQuery(checkQuery, [id]);
        if (existingMidia.length === 0) {
            throw new Error('Mídia não encontrada');
        }

        const deleteQuery = 'DELETE FROM midia WHERE idmidia = ?';
        await db.executeQuery(deleteQuery, [id]);
        return { message: 'Mídia deletada com sucesso' };
    }

    static async deleteByPublicacao(publicacaoId) {
        const deleteQuery = 'DELETE FROM midia WHERE postagem_idcomunidade = ?';
        await db.executeQuery(deleteQuery, [publicacaoId]);
        return { message: 'Mídias da publicação deletadas com sucesso' };
    }
}

module.exports = Midia;

