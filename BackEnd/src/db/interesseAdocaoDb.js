const db = require('./dbConfig');

class InteresseAdocaoDb {

    static async insert(model) {
        const conn = await db.connect();

        const mensagem = model.mensagem;
        const interesse_status = model.interesse_status;
        const data_interesse = model.data_interesse;
        const usuario_idusuario = model.usuario_idusuario;
        const animal_idAnimal = model.animal_idAnimal;
        const animal_fk_idusuario = model.animal_fk_idusuario;
        const animal_fk_idstatus = model.animal_fk_idstatus;

        const query = `INSERT INTO interesse_adocao (mensagem, interesse_status, data_interesse, 
                       usuario_idusuario, animal_idAnimal, animal_fk_idusuario, animal_fk_idstatus) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        try {
            const [result] = await conn.execute(query, [mensagem, interesse_status, data_interesse, 
                usuario_idusuario, animal_idAnimal, animal_fk_idusuario, animal_fk_idstatus]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectAll() {
        const conn = await db.connect();

        const query = `SELECT i.*, u.nome as nome_interessado, a.nome as nome_animal, 
                       u2.nome as nome_dono_animal
                       FROM interesse_adocao i
                       LEFT JOIN usuario u ON i.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON i.animal_idAnimal = a.idAnimal
                       LEFT JOIN usuario u2 ON i.animal_fk_idusuario = u2.idusuario
                       ORDER BY i.data_interesse DESC`;
        
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

        const query = `SELECT i.*, u.nome as nome_interessado, a.nome as nome_animal, 
                       u2.nome as nome_dono_animal
                       FROM interesse_adocao i
                       LEFT JOIN usuario u ON i.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON i.animal_idAnimal = a.idAnimal
                       LEFT JOIN usuario u2 ON i.animal_fk_idusuario = u2.idusuario
                       WHERE i.idinteresse_adocao = ?`;
        
        try {
            const [result] = await conn.execute(query, [id]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByUsuario(idusuario) {
        const conn = await db.connect();

        const query = `SELECT i.*, u.nome as nome_interessado, a.nome as nome_animal, 
                       u2.nome as nome_dono_animal
                       FROM interesse_adocao i
                       LEFT JOIN usuario u ON i.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON i.animal_idAnimal = a.idAnimal
                       LEFT JOIN usuario u2 ON i.animal_fk_idusuario = u2.idusuario
                       WHERE i.usuario_idusuario = ?
                       ORDER BY i.data_interesse DESC`;
        
        try {
            const [result] = await conn.execute(query, [idusuario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByAnimal(idAnimal) {
        const conn = await db.connect();

        const query = `SELECT i.*, u.nome as nome_interessado, a.nome as nome_animal, 
                       u2.nome as nome_dono_animal
                       FROM interesse_adocao i
                       LEFT JOIN usuario u ON i.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON i.animal_idAnimal = a.idAnimal
                       LEFT JOIN usuario u2 ON i.animal_fk_idusuario = u2.idusuario
                       WHERE i.animal_idAnimal = ?
                       ORDER BY i.data_interesse DESC`;
        
        try {
            const [result] = await conn.execute(query, [idAnimal]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByDonoAnimal(idusuario) {
        const conn = await db.connect();

        const query = `SELECT i.*, u.nome as nome_interessado, a.nome as nome_animal, 
                       u2.nome as nome_dono_animal
                       FROM interesse_adocao i
                       LEFT JOIN usuario u ON i.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON i.animal_idAnimal = a.idAnimal
                       LEFT JOIN usuario u2 ON i.animal_fk_idusuario = u2.idusuario
                       WHERE i.animal_fk_idusuario = ?
                       ORDER BY i.data_interesse DESC`;
        
        try {
            const [result] = await conn.execute(query, [idusuario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByStatus(status) {
        const conn = await db.connect();

        const query = `SELECT i.*, u.nome as nome_interessado, a.nome as nome_animal, 
                       u2.nome as nome_dono_animal
                       FROM interesse_adocao i
                       LEFT JOIN usuario u ON i.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON i.animal_idAnimal = a.idAnimal
                       LEFT JOIN usuario u2 ON i.animal_fk_idusuario = u2.idusuario
                       WHERE i.interesse_status = ?
                       ORDER BY i.data_interesse DESC`;
        
        try {
            const [result] = await conn.execute(query, [status]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async update(model) {
        const conn = await db.connect();

        const idinteresse_adocao = model.idinteresse_adocao;
        const mensagem = model.mensagem;
        const interesse_status = model.interesse_status;

        const query = 'UPDATE interesse_adocao SET mensagem = ?, interesse_status = ? WHERE idinteresse_adocao = ?';

        try {
            const [result] = await conn.execute(query, [mensagem, interesse_status, idinteresse_adocao]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async updateStatus(id, status) {
        const conn = await db.connect();

        const query = 'UPDATE interesse_adocao SET interesse_status = ? WHERE idinteresse_adocao = ?';

        try {
            const [result] = await conn.execute(query, [status, id]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM interesse_adocao WHERE idinteresse_adocao = ?';

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

module.exports = InteresseAdocaoDb;

