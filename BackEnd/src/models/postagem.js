const db = require("../db/dbConfig");

class Postagem {
    static async getAll() {
        const query = `
            SELECT 
                p.idcomunidade, p.descricao, p.comunidadecol, p.data, p.titulo,
                p.animal_idAnimal, p.usuario_idusuario,
                u.nome as autor_nome,
                a.nome as animal_nome, a.raca as animal_raca
            FROM postagem p
            LEFT JOIN usuario u ON p.usuario_idusuario = u.idusuario
            LEFT JOIN animal a ON p.animal_idAnimal = a.idAnimal
            ORDER BY p.data DESC
        `;
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = `
            SELECT 
                p.idcomunidade, p.descricao, p.comunidadecol, p.data, p.titulo,
                p.animal_idAnimal, p.usuario_idusuario,
                u.nome as autor_nome,
                a.nome as animal_nome, a.raca as animal_raca
            FROM postagem p
            LEFT JOIN usuario u ON p.usuario_idusuario = u.idusuario
            LEFT JOIN animal a ON p.animal_idAnimal = a.idAnimal
            WHERE p.idcomunidade = ?
        `;
        const postagens = await db.executeQuery(query, [id]);
        return postagens.length > 0 ? postagens[0] : null;
    }

    static async create(descricao, comunidadecol, titulo, animal_idAnimal, usuario_idusuario) {
        const userCheck = await db.executeQuery('SELECT idusuario FROM usuario WHERE idusuario = ?', [usuario_idusuario]);
        if (userCheck.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        const animalCheck = await db.executeQuery('SELECT idAnimal FROM animal WHERE idAnimal = ?', [animal_idAnimal]);
        if (animalCheck.length === 0) {
            throw new Error('Animal não encontrado');
        }

        const insertQuery = 'INSERT INTO postagem (descricao, comunidadecol, data, titulo, animal_idAnimal, usuario_idusuario) VALUES (?, ?, CURDATE(), ?, ?, ?)';
        const result = await db.executeQuery(insertQuery, [descricao, comunidadecol, titulo, animal_idAnimal, usuario_idusuario]);
        return this.getById(result.insertId);
    }

    static async update(id, descricao, comunidadecol, titulo) {
        const checkQuery = 'SELECT idcomunidade FROM postagem WHERE idcomunidade = ?';
        const existingPostagem = await db.executeQuery(checkQuery, [id]);
        if (existingPostagem.length === 0) {
            throw new Error('Postagem não encontrada');
        }

        const updates = [];
        const values = [];
        if (descricao) { updates.push('descricao = ?'); values.push(descricao); }
        if (comunidadecol) { updates.push('comunidadecol = ?'); values.push(comunidadecol); }
        if (titulo) { updates.push('titulo = ?'); values.push(titulo); }

        if (updates.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        values.push(id);
        const updateQuery = `UPDATE postagem SET ${updates.join(', ')} WHERE idcomunidade = ?`;
        await db.executeQuery(updateQuery, values);
        return this.getById(id);
    }

    static async delete(id) {
        const checkQuery = 'SELECT idcomunidade FROM postagem WHERE idcomunidade = ?';
        const existingPostagem = await db.executeQuery(checkQuery, [id]);
        if (existingPostagem.length === 0) {
            throw new Error('Postagem não encontrada');
        }

        await db.executeQuery('DELETE FROM comentario WHERE fk_idcomunidade = ?', [id]);
        await db.executeQuery('DELETE FROM midia WHERE postagem_idcomunidade = ?', [id]);

        const deleteQuery = 'DELETE FROM postagem WHERE idcomunidade = ?';
        await db.executeQuery(deleteQuery, [id]);
        return { message: 'Postagem deletada com sucesso' };
    }
}

module.exports = Postagem;

