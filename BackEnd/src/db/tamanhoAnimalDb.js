const db = require('./dbMysqlConfig');

class TamanhoAnimalDb {

    static async insert(model) {
        const conn = await db.connect();

        const descricao = model.descricao;

        const query = 'INSERT INTO tamanho_animal (descricao) VALUES (?)';

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

        const query = 'SELECT * FROM tamanho_animal';
        
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

        const query = 'SELECT * FROM tamanho_animal WHERE idtamanho_animal = ?';
        
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

        const idtamanho_animal = model.idtamanho_animal;
        const descricao = model.descricao;

        const query = 'UPDATE tamanho_animal SET descricao = ? WHERE idtamanho_animal = ?';

        try {
            const [result] = await conn.execute(query, [descricao, idtamanho_animal]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM tamanho_animal WHERE idtamanho_animal = ?';

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

module.exports = TamanhoAnimalDb;

