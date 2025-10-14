const db = require('./dbConfig');

class InteresseAdocaoDb {

    static async insert(model) {
        const conn = await db.connect();

        const { mensagem, interesse_status, data_interesse, usuario_idusuario, animal_idAnimal } = model;

        const query = `INSERT INTO interesse_adocao (mensagem, interesse_status, data_interesse, usuario_idusuario, animal_idAnimal) 
                       VALUES (?, ?, ?, ?, ?)`;

        try {
            const [result] = await conn.execute(query, [mensagem, interesse_status, data_interesse, usuario_idusuario, animal_idAnimal]);
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
                       LEFT JOIN usuario u2 ON a.fk_idusuario = u2.idusuario
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
                       LEFT JOIN usuario u2 ON a.fk_idusuario = u2.idusuario
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
                       u2.nome as nome_dono_animal, u2.email as dono_email, u2.telefone as dono_telefone
                       FROM interesse_adocao i
                       LEFT JOIN usuario u ON i.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON i.animal_idAnimal = a.idAnimal
                       LEFT JOIN usuario u2 ON a.fk_idusuario = u2.idusuario
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
                       LEFT JOIN usuario u2 ON a.fk_idusuario = u2.idusuario
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

    static async selectByUsuarioAndAnimal(idusuario, idAnimal) {
        const conn = await db.connect();

        const query = `SELECT * FROM interesse_adocao WHERE usuario_idusuario = ? AND animal_idAnimal = ?`;
        
        try {
            const [result] = await conn.execute(query, [idusuario, idAnimal]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByDonoAnimal(idusuario) {
        const conn = await db.connect();

        const query = `SELECT i.*, u.nome as nome_interessado, u.email as interessado_email, u.telefone as interessado_telefone, a.nome as nome_animal, 
                       u2.nome as nome_dono_animal
                       FROM interesse_adocao i
                       LEFT JOIN usuario u ON i.usuario_idusuario = u.idusuario
                       LEFT JOIN animal a ON i.animal_idAnimal = a.idAnimal
                       LEFT JOIN usuario u2 ON a.fk_idusuario = u2.idusuario
                       WHERE a.fk_idusuario = ?
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
                       LEFT JOIN usuario u2 ON a.fk_idusuario = u2.idusuario
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

    static async aprovarAdocao(id) {
        const conn = await db.connect();
        try {
            await conn.beginTransaction();

            // 1. Obter o id do animal a partir do interesse
            const [rows] = await conn.execute('SELECT animal_idAnimal FROM interesse_adocao WHERE idinteresse_adocao = ?', [id]);
            if (rows.length === 0) {
                throw new Error('Interesse de adoção não encontrado.');
            }
            const animalId = rows[0].animal_idAnimal;

            // 2. Obter o id do status 'Adotado'
            const [statusRows] = await conn.execute('SELECT idstatus FROM status WHERE tipo = ?', ['Adotado']);
            if (statusRows.length === 0) {
                throw new Error('Status \'Adotado\' não encontrado na tabela de status.');
            }
            const adotadoStatusId = statusRows[0].idstatus;

            // 3. Atualizar o status do animal para 'Adotado'
            await conn.execute('UPDATE animal SET fk_idstatus = ? WHERE idAnimal = ?', [adotadoStatusId, animalId]);

            // 4. Atualizar o interesse de adoção aprovado para 'Aprovado'
            await conn.execute('UPDATE interesse_adocao SET interesse_status = ? WHERE idinteresse_adocao = ?', ['Aprovado', id]);

            // 5. Rejeitar todos os outros interesses para o mesmo animal
            await conn.execute('UPDATE interesse_adocao SET interesse_status = ? WHERE animal_idAnimal = ? AND idinteresse_adocao != ?', ['Recusado', animalId, id]);

            await conn.commit();
            conn.release();
            return { success: true, message: 'Adoção aprovada com sucesso.' };

        } catch (error) {
            await conn.rollback();
            conn.release();
            throw error;
        }
    }
}

module.exports = InteresseAdocaoDb;

