const db = require("../db/dbConfig");

class Status {
    static async getAll() {
        const query = 'SELECT * FROM status';
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = 'SELECT * FROM status WHERE idstatus = ?';
        const status = await db.executeQuery(query, [id]);
        return status.length > 0 ? status[0] : null;
    }

    static async create(tipo) {
        const checkQuery = 'SELECT idstatus FROM status WHERE tipo = ?';
        const existingStatus = await db.executeQuery(checkQuery, [tipo]);
        if (existingStatus.length > 0) {
            throw new Error('Tipo de status já existe');
        }
        const insertQuery = 'INSERT INTO status (tipo) VALUES (?)';
        const result = await db.executeQuery(insertQuery, [tipo]);
        return this.getById(result.insertId);
    }

    static async update(id, tipo) {
        const checkQuery = 'SELECT idstatus FROM status WHERE idstatus = ?';
        const existingStatus = await db.executeQuery(checkQuery, [id]);
        if (existingStatus.length === 0) {
            throw new Error('Status não encontrado');
        }

        const typeCheck = await db.executeQuery('SELECT idstatus FROM status WHERE tipo = ? AND idstatus != ?', [tipo, id]);
        if (typeCheck.length > 0) {
            throw new Error('Tipo de status já existe');
        }

        const updateQuery = 'UPDATE status SET tipo = ? WHERE idstatus = ?';
        await db.executeQuery(updateQuery, [tipo, id]);
        return this.getById(id);
    }

    static async delete(id) {
        const checkQuery = 'SELECT idstatus FROM status WHERE idstatus = ?';
        const existingStatus = await db.executeQuery(checkQuery, [id]);
        if (existingStatus.length === 0) {
            throw new Error('Status não encontrado');
        }

        const animalCheck = await db.executeQuery('SELECT idAnimal FROM animal WHERE fk_idstatus = ?', [id]);
        if (animalCheck.length > 0) {
            throw new Error('Não é possível deletar status que está sendo usado por animais');
        }

        const deleteQuery = 'DELETE FROM status WHERE idstatus = ?';
        await db.executeQuery(deleteQuery, [id]);
        return { message: 'Status deletado com sucesso' };
    }
}

module.exports = Status;

