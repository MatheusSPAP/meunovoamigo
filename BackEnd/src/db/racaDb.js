const db = require('./dbMysqlConfig');

class RacaDb {

    static async selectAll() {
        const conn = await db.connect();

        const query = 'SELECT * FROM raca';
        
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

        const query = 'SELECT * FROM raca WHERE idraca = ?';
        
        try {
            const [result] = await conn.execute(query, [id]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async insert(model) {
        const conn = await db.connect();

        const tipo_raca = model.tipo_raca;

        const query = 'INSERT INTO raca (tipo_raca) VALUES (?)';

        try {
            const [result] = await conn.execute(query, [tipo_raca]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async update(model) {
        const conn = await db.connect();

        const idraca = model.idraca;
        const tipo_raca = model.tipo_raca;

        const query = 'UPDATE raca SET tipo_raca = ? WHERE idraca = ?';

        try {
            const [result] = await conn.execute(query, [tipo_raca, idraca]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM raca WHERE idraca = ?';

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

module.exports = RacaDb;
