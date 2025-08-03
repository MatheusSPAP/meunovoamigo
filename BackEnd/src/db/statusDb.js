const db = require('./dbMysqlConfig');

class StatusDb {

    static async insert(model) {
        const conn = await db.connect();

        const tipo = model.tipo;

        const query = 'INSERT INTO status (tipo) VALUES (?)';

        try {
            const [result] = await conn.execute(query, [tipo]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectAll() {
        const conn = await db.connect();

        const query = 'SELECT * FROM status';
        
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

        const query = 'SELECT * FROM status WHERE idstatus = ?';
        
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

        const idstatus = model.idstatus;
        const tipo = model.tipo;

        const query = 'UPDATE status SET tipo = ? WHERE idstatus = ?';

        try {
            const [result] = await conn.execute(query, [tipo, idstatus]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM status WHERE idstatus = ?';

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

module.exports = StatusDb;

