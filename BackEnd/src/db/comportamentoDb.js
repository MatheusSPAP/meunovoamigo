const db = require('./dbMysqlConfig');

class ComportamentoDb {

    static async insert(model) {
        const conn = await db.connect();

        const descricao = model.descricao;

        const query = 'INSERT INTO comportamento (descricao) VALUES (?)';

        try {
            const [result] = await conn.execute(query, [descricao]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectAll() {
        const conn = await db.connect();

        const query = 'SELECT * FROM comportamento';
        
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

        const query = 'SELECT * FROM comportamento WHERE idcomportamento = ?';
        
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

        const idcomportamento = model.idcomportamento;
        const descricao = model.descricao;

        const query = 'UPDATE comportamento SET descricao = ? WHERE idcomportamento = ?';

        try {
            const [result] = await conn.execute(query, [descricao, idcomportamento]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM comportamento WHERE idcomportamento = ?';

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

module.exports = ComportamentoDb;
