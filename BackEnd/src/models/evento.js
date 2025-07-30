const db = require("../db/dbConfig");

class Evento {
    static async getAll() {
        const query = `
            SELECT 
                e.idEvento, e.titulo, e.tipo_evento, e.data, e.endereco, e.descricao,
                e.fk_idusuario, u.nome as organizador_nome
            FROM evento e
            LEFT JOIN usuario u ON e.fk_idusuario = u.idusuario
            ORDER BY e.data DESC
        `;
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = `
            SELECT 
                e.idEvento, e.titulo, e.tipo_evento, e.data, e.endereco, e.descricao,
                e.fk_idusuario, u.nome as organizador_nome
            FROM evento e
            LEFT JOIN usuario u ON e.fk_idusuario = u.idusuario
            WHERE e.idEvento = ?
        `;
        const eventos = await db.executeQuery(query, [id]);
        return eventos.length > 0 ? eventos[0] : null;
    }

    static async create(titulo, tipo_evento, data, endereco, descricao, fk_idusuario) {
        const userCheck = await db.executeQuery('SELECT idusuario FROM usuario WHERE idusuario = ?', [fk_idusuario]);
        if (userCheck.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        const insertQuery = 'INSERT INTO evento (titulo, tipo_evento, data, endereco, descricao, fk_idusuario) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await db.executeQuery(insertQuery, [titulo, tipo_evento, data, endereco, descricao, fk_idusuario]);
        return this.getById(result.insertId);
    }

    static async update(id, titulo, tipo_evento, data, endereco, descricao, fk_idusuario) {
        const checkQuery = 'SELECT idEvento FROM evento WHERE idEvento = ?';
        const existingEvento = await db.executeQuery(checkQuery, [id]);
        if (existingEvento.length === 0) {
            throw new Error('Evento não encontrado');
        }

        if (fk_idusuario) {
            const userCheck = await db.executeQuery('SELECT idusuario FROM usuario WHERE idusuario = ?', [fk_idusuario]);
            if (userCheck.length === 0) {
                throw new Error('Usuário não encontrado');
            }
        }

        const updates = [];
        const values = [];
        if (titulo) { updates.push('titulo = ?'); values.push(titulo); }
        if (tipo_evento) { updates.push('tipo_evento = ?'); values.push(tipo_evento); }
        if (data) { updates.push('data = ?'); values.push(data); }
        if (endereco) { updates.push('endereco = ?'); values.push(endereco); }
        if (descricao) { updates.push('descricao = ?'); values.push(descricao); }
        if (fk_idusuario) { updates.push('fk_idusuario = ?'); values.push(fk_idusuario); }

        if (updates.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        values.push(id);
        const updateQuery = `UPDATE evento SET ${updates.join(', ')} WHERE idEvento = ?`;
        await db.executeQuery(updateQuery, values);
        return this.getById(id);
    }

    static async delete(id) {
        const checkQuery = 'SELECT idEvento FROM evento WHERE idEvento = ?';
        const existingEvento = await db.executeQuery(checkQuery, [id]);
        if (existingEvento.length === 0) {
            throw new Error('Evento não encontrado');
        }

        const deleteQuery = 'DELETE FROM evento WHERE idEvento = ?';
        await db.executeQuery(deleteQuery, [id]);
        return { message: 'Evento deletado com sucesso' };
    }

    static async getByUsuario(usuarioId) {
        const query = `
            SELECT 
                e.idEvento, e.titulo, e.tipo_evento, e.data, e.endereco, e.descricao,
                e.fk_idusuario, u.nome as organizador_nome
            FROM evento e
            LEFT JOIN usuario u ON e.fk_idusuario = u.idusuario
            WHERE e.fk_idusuario = ?
            ORDER BY e.data DESC
        `;
        return await db.executeQuery(query, [usuarioId]);
    }

    static async getByTipo(tipo) {
        const query = `
            SELECT 
                e.idEvento, e.titulo, e.tipo_evento, e.data, e.endereco, e.descricao,
                e.fk_idusuario, u.nome as organizador_nome
            FROM evento e
            LEFT JOIN usuario u ON e.fk_idusuario = u.idusuario
            WHERE e.tipo_evento = ?
            ORDER BY e.data DESC
        `;
        return await db.executeQuery(query, [tipo]);
    }

    static async getProximos() {
        const query = `
            SELECT 
                e.idEvento, e.titulo, e.tipo_evento, e.data, e.endereco, e.descricao,
                e.fk_idusuario, u.nome as organizador_nome
            FROM evento e
            LEFT JOIN usuario u ON e.fk_idusuario = u.idusuario
            WHERE e.data >= NOW()
            ORDER BY e.data ASC
        `;
        return await db.executeQuery(query);
    }
}

module.exports = Evento;

