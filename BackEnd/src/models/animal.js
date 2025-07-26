const db = require("../db/dbConfig");

class Animal {
    static async getAll() {
        const query = `
            SELECT 
                a.idAnimal, a.nome, a.raca, a.foto, a.descricao,
                a.fk_idusuario, a.fk_idstatus,
                u.nome as dono_nome,
                s.tipo as status_tipo
            FROM animal a
            LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
            LEFT JOIN status s ON a.fk_idstatus = s.idstatus
        `;
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = `
            SELECT 
                a.idAnimal, a.nome, a.raca, a.foto, a.descricao,
                a.fk_idusuario, a.fk_idstatus,
                u.nome as dono_nome,
                s.tipo as status_tipo
            FROM animal a
            LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
            LEFT JOIN status s ON a.fk_idstatus = s.idstatus
            WHERE a.idAnimal = ?
        `;
        const animais = await db.executeQuery(query, [id]);
        return animais.length > 0 ? animais[0] : null;
    }

    static async create(nome, raca, foto, descricao, fk_idusuario, fk_idstatus) {
        const userCheck = await db.executeQuery('SELECT idusuario FROM usuario WHERE idusuario = ?', [fk_idusuario]);
        if (userCheck.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        const statusCheck = await db.executeQuery('SELECT idstatus FROM status WHERE idstatus = ?', [fk_idstatus]);
        if (statusCheck.length === 0) {
            throw new Error('Status não encontrado');
        }

        const insertQuery = 'INSERT INTO animal (nome, raca, foto, descricao, fk_idusuario, fk_idstatus) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await db.executeQuery(insertQuery, [nome, raca, foto, descricao, fk_idusuario, fk_idstatus]);
        return this.getById(result.insertId);
    }

    static async update(id, nome, raca, foto, descricao, fk_idusuario, fk_idstatus) {
        const checkQuery = 'SELECT idAnimal FROM animal WHERE idAnimal = ?';
        const existingAnimal = await db.executeQuery(checkQuery, [id]);
        if (existingAnimal.length === 0) {
            throw new Error('Animal não encontrado');
        }

        if (fk_idusuario) {
            const userCheck = await db.executeQuery('SELECT idusuario FROM usuario WHERE idusuario = ?', [fk_idusuario]);
            if (userCheck.length === 0) {
                throw new Error('Usuário não encontrado');
            }
        }

        if (fk_idstatus) {
            const statusCheck = await db.executeQuery('SELECT idstatus FROM status WHERE idstatus = ?', [fk_idstatus]);
            if (statusCheck.length === 0) {
                throw new Error('Status não encontrado');
            }
        }

        const updates = [];
        const values = [];
        if (nome) { updates.push('nome = ?'); values.push(nome); }
        if (raca) { updates.push('raca = ?'); values.push(raca); }
        if (foto) { updates.push('foto = ?'); values.push(foto); }
        if (descricao) { updates.push('descricao = ?'); values.push(descricao); }
        if (fk_idusuario) { updates.push('fk_idusuario = ?'); values.push(fk_idusuario); }
        if (fk_idstatus) { updates.push('fk_idstatus = ?'); values.push(fk_idstatus); }

        if (updates.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        values.push(id);
        const updateQuery = `UPDATE animal SET ${updates.join(', ')} WHERE idAnimal = ?`;
        await db.executeQuery(updateQuery, values);
        return this.getById(id);
    }

    static async delete(id) {
        const checkQuery = 'SELECT idAnimal FROM animal WHERE idAnimal = ?';
        const existingAnimal = await db.executeQuery(checkQuery, [id]);
        if (existingAnimal.length === 0) {
            throw new Error('Animal não encontrado');
        }
        const deleteQuery = 'DELETE FROM animal WHERE idAnimal = ?';
        await db.executeQuery(deleteQuery, [id]);
        return { message: 'Animal deletado com sucesso' };
    }

    static async getByStatus(status) {
        const query = `
            SELECT 
                a.idAnimal, a.nome, a.raca, a.foto, a.descricao,
                a.fk_idusuario, a.fk_idstatus,
                u.nome as dono_nome,
                s.tipo as status_tipo
            FROM animal a
            LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
            LEFT JOIN status s ON a.fk_idstatus = s.idstatus
            WHERE s.tipo = ?
        `;
        return await db.executeQuery(query, [status]);
    }
}

module.exports = Animal;

