const db = require("../db/dbConfig");

class Raca {
    static async getAll() {
        const query = `
            SELECT 
                r.idraca, r.nome, r.fk_idtipo,
                t.nome as tipo_nome
            FROM raca r
            LEFT JOIN tipo_animal t ON r.fk_idtipo = t.idtipo
        `;
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = `
            SELECT 
                r.idraca, r.nome, r.fk_idtipo,
                t.nome as tipo_nome
            FROM raca r
            LEFT JOIN tipo_animal t ON r.fk_idtipo = t.idtipo
            WHERE r.idraca = ?
        `;
        const raca = await db.executeQuery(query, [id]);
        return raca.length > 0 ? raca[0] : null;
    }

    static async getByTipo(tipoId) {
        const query = `
            SELECT 
                r.idraca, r.nome, r.fk_idtipo,
                t.nome as tipo_nome
            FROM raca r
            LEFT JOIN tipo_animal t ON r.fk_idtipo = t.idtipo
            WHERE r.fk_idtipo = ?
        `;
        return await db.executeQuery(query, [tipoId]);
    }

    static async create(nome, fk_idtipo) {
        const tipoCheck = await db.executeQuery('SELECT idtipo FROM tipo_animal WHERE idtipo = ?', [fk_idtipo]);
        if (tipoCheck.length === 0) {
            throw new Error('Tipo de animal não encontrado');
        }

        const insertQuery = 'INSERT INTO raca (nome, fk_idtipo) VALUES (?, ?)';
        const result = await db.executeQuery(insertQuery, [nome, fk_idtipo]);
        return this.getById(result.insertId);
    }

    static async update(id, nome, fk_idtipo) {
        const checkQuery = 'SELECT idraca FROM raca WHERE idraca = ?';
        const existingRaca = await db.executeQuery(checkQuery, [id]);
        if (existingRaca.length === 0) {
            throw new Error('Raça não encontrada');
        }

        if (fk_idtipo) {
            const tipoCheck = await db.executeQuery('SELECT idtipo FROM tipo_animal WHERE idtipo = ?', [fk_idtipo]);
            if (tipoCheck.length === 0) {
                throw new Error('Tipo de animal não encontrado');
            }
        }

        const updates = [];
        const values = [];
        if (nome) { updates.push('nome = ?'); values.push(nome); }
        if (fk_idtipo) { updates.push('fk_idtipo = ?'); values.push(fk_idtipo); }

        if (updates.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        values.push(id);
        const updateQuery = `UPDATE raca SET ${updates.join(', ')} WHERE idraca = ?`;
        await db.executeQuery(updateQuery, values);
        return this.getById(id);
    }

    static async delete(id) {
        const checkQuery = 'SELECT idraca FROM raca WHERE idraca = ?';
        const existingRaca = await db.executeQuery(checkQuery, [id]);
        if (existingRaca.length === 0) {
            throw new Error('Raça não encontrada');
        }

        const animalCheck = await db.executeQuery('SELECT idAnimal FROM animal WHERE fk_idraca = ?', [id]);
        if (animalCheck.length > 0) {
            throw new Error('Não é possível deletar raça que está sendo usada por animais');
        }

        const deleteQuery = 'DELETE FROM raca WHERE idraca = ?';
        await db.executeQuery(deleteQuery, [id]);
        return { message: 'Raça deletada com sucesso' };
    }
}

module.exports = Raca;

