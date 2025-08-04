const db = require('./dbConfig');

class TipoDb {

    static async insert(model) {
        const conn = await db.connect();

        const tipo_animal = model.tipo_animal;

        const query = 'INSERT INTO tipo (tipo_animal) VALUES (?)';

        try {
            const [result] = await conn.execute(query, [tipo_animal]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectAll() {
        const conn = await db.connect();

        const query = 'SELECT * FROM tipo';
        
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

        const query = 'SELECT * FROM tipo WHERE idtipo_animal = ?';
        
        try {
            const [result] = await conn.execute(query, [id]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async update(model) {
        const conn = await db.connect();

        const idtipo_animal = model.idtipo_animal;
        const tipo_animal = model.tipo_animal;

        const query = 'UPDATE tipo SET tipo_animal = ? WHERE idtipo_animal = ?';

        try {
            const [result] = await conn.execute(query, [tipo_animal, idtipo_animal]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM tipo WHERE idtipo_animal = ?';

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

module.exports = TipoDb;

