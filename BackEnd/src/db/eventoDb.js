const db = require('./dbConfig');

class EventoDb {

    static async insert(model) {
        const conn = await db.connect();

        const titulo = model.titulo;
        const tipo_evento = model.tipo_evento;
        const endereco = model.endereco;
        const descricao = model.descricao;
        const data = model.data;
        const fk_idusuario = model.fk_idusuario;

        const query = 'INSERT INTO evento (titulo, tipo_evento, endereco, descricao, data, fk_idusuario) VALUES (?, ?, ?, ?, ?, ?)';

        try {
            const [result] = await conn.execute(query, [titulo, tipo_evento, endereco, descricao, data, fk_idusuario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectAll(ordenar = 'ASC') {
        const conn = await db.connect();

        const query = `SELECT e.*, u.nome as nome_usuario
                       FROM evento e
                       LEFT JOIN usuario u ON e.fk_idusuario = u.idusuario
                       ORDER BY e.data ${ordenar}`;
        
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

        const query = `SELECT e.*, u.nome as nome_usuario
                       FROM evento e
                       LEFT JOIN usuario u ON e.fk_idusuario = u.idusuario
                       WHERE e.idEvento = ?`;
        
        try {
            const [result] = await conn.execute(query, [id]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByUsuario(idusuario, ordenar = 'ASC') {
        const conn = await db.connect();

        const query = `SELECT e.*, u.nome as nome_usuario
                       FROM evento e
                       LEFT JOIN usuario u ON e.fk_idusuario = u.idusuario
                       WHERE e.fk_idusuario = ?
                       ORDER BY e.data ${ordenar}`;
        
        try {
            const [result] = await conn.execute(query, [idusuario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByTipo(tipo_evento, ordenar = 'ASC') {
        const conn = await db.connect();

        const query = `SELECT e.*, u.nome as nome_usuario
                       FROM evento e
                       LEFT JOIN usuario u ON e.fk_idusuario = u.idusuario
                       WHERE e.tipo_evento = ?
                       ORDER BY e.data ${ordenar}`;
        
        try {
            const [result] = await conn.execute(query, [tipo_evento]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByData(dataInicio, dataFim, ordenar = 'ASC') {
        const conn = await db.connect();

        let query = `SELECT e.*, u.nome as nome_usuario
                       FROM evento e
                       LEFT JOIN usuario u ON e.fk_idusuario = u.idusuario`;
        let params = [];
        let whereClauses = [];

        if (dataInicio) {
            whereClauses.push('e.data >= ?');
            params.push(dataInicio);
        }
        if (dataFim) {
            whereClauses.push('e.data <= ?');
            params.push(dataFim);
        }

        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }

        query += ` ORDER BY e.data ${ordenar}`;
        
        try {
            const [result] = await conn.execute(query, params);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async update(model) {
        const conn = await db.connect();

        const idEvento = model.idEvento;
        const titulo = model.titulo;
        const tipo_evento = model.tipo_evento;
        const endereco = model.endereco;
        const descricao = model.descricao;
        const data = model.data;

        const query = 'UPDATE evento SET titulo = ?, tipo_evento = ?, endereco = ?, descricao = ?, data = ? WHERE idEvento = ?';

        try {
            const [result] = await conn.execute(query, [titulo, tipo_evento, endereco, descricao, data, idEvento]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM evento WHERE idEvento = ?';

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

module.exports = EventoDb;

