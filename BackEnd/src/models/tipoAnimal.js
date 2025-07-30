const db = require("../db/dbConfig");

class TipoAnimal {
    static async getAll() {
        const query = 'SELECT idtipo, nome FROM tipo_animal';
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = 'SELECT idtipo, nome FROM tipo_animal WHERE idtipo = ?';
        const tipo = await db.executeQuery(query, [id]);
        return tipo.length > 0 ? tipo[0] : null;
    }

    static async create(nome) {
        const checkQuery = 'SELECT idtipo FROM tipo_animal WHERE nome = ?';
        const existingTipo = await db.executeQuery(checkQuery, [nome]);
        if (existingTipo.length > 0) {
            throw new Error('Tipo de animal já existe');
        }
        const insertQuery = 'INSERT INTO tipo_animal (nome) VALUES (?)';
        const result = await db.executeQuery(insertQuery, [nome]);
        return this.getById(result.insertId);
    }

    static async update(id, nome) {
        const checkQuery = 'SELECT idtipo FROM tipo_animal WHERE idtipo = ?';
        const existingTipo = await db.executeQuery(checkQuery, [id]);
        if (existingTipo.length === 0) {
            throw new Error('Tipo de animal não encontrado');
        }

        const nameCheck = await db.executeQuery('SELECT idtipo FROM tipo_animal WHERE nome = ? AND idtipo != ?', [nome, id]);
        if (nameCheck.length > 0) {
            throw new Error('Tipo de animal já existe');
        }

        const updateQuery = 'UPDATE tipo_animal SET nome = ? WHERE idtipo = ?';
        await db.executeQuery(updateQuery, [nome, id]);
        return this.getById(id);
    }

    static async delete(id) {
        const checkQuery = 'SELECT idtipo FROM tipo_animal WHERE idtipo = ?';
        const existingTipo = await db.executeQuery(checkQuery, [id]);
        if (existingTipo.length === 0) {
            throw new Error('Tipo de animal não encontrado');
        }

        const racaCheck = await db.executeQuery('SELECT idraca FROM raca WHERE fk_idtipo = ?', [id]);
        if (racaCheck.length > 0) {
            throw new Error('Não é possível deletar tipo de animal que está sendo usado por raças');
        }

        const deleteQuery = 'DELETE FROM tipo_animal WHERE idtipo = ?';
        await db.executeQuery(deleteQuery, [id]);
        return { message: 'Tipo de animal deletado com sucesso' };
    }
}

module.exports = TipoAnimal;

