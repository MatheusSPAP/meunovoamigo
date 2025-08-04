const db = require("../db/dbConfig");

class Animal {
    static async getAll() {
        const query = `
            SELECT 
                a.idAnimal, a.nome, a.raca, a.foto, a.descricao,
                a.latitude, a.longitude, a.data_criacao,
                a.fk_idraca, a.fk_idusuario, a.fk_idstatus,
                u.nome as dono_nome,
                s.tipo as status_tipo,
                r.nome as raca_nome,
                t.nome as tipo_nome
            FROM animal a
            LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
            LEFT JOIN status s ON a.fk_idstatus = s.idstatus
            LEFT JOIN raca r ON a.fk_idraca = r.idraca
            LEFT JOIN tipo_animal t ON r.fk_idtipo = t.idtipo
        `;
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = `
            SELECT 
                a.idAnimal, a.nome, a.raca, a.foto, a.descricao,
                a.latitude, a.longitude, a.data_criacao,
                a.fk_idraca, a.fk_idusuario, a.fk_idstatus,
                u.nome as dono_nome,
                s.tipo as status_tipo,
                r.nome as raca_nome,
                t.nome as tipo_nome
            FROM animal a
            LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
            LEFT JOIN status s ON a.fk_idstatus = s.idstatus
            LEFT JOIN raca r ON a.fk_idraca = r.idraca
            LEFT JOIN tipo_animal t ON r.fk_idtipo = t.idtipo
            WHERE a.idAnimal = ?
        `;
        const animais = await db.executeQuery(query, [id]);
        return animais.length > 0 ? animais[0] : null;
    }

    static async create(nome, raca, foto, descricao, latitude, longitude, fk_idraca, fk_idusuario, fk_idstatus) {
        const userCheck = await db.executeQuery('SELECT idusuario FROM usuario WHERE idusuario = ?', [fk_idusuario]);
        if (userCheck.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        const statusCheck = await db.executeQuery('SELECT idstatus FROM status WHERE idstatus = ?', [fk_idstatus]);
        if (statusCheck.length === 0) {
            throw new Error('Status não encontrado');
        }

        const racaCheck = await db.executeQuery('SELECT idraca FROM raca WHERE idraca = ?', [fk_idraca]);
        if (racaCheck.length === 0) {
            throw new Error('Raça não encontrada');
        }

        const insertQuery = 'INSERT INTO animal (nome, raca, foto, descricao, latitude, longitude, fk_idraca, fk_idusuario, fk_idstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await db.executeQuery(insertQuery, [nome, raca, foto, descricao, latitude, longitude, fk_idraca, fk_idusuario, fk_idstatus]);
        return this.getById(result.insertId);
    }

    static async update(id, nome, raca, foto, descricao, latitude, longitude, fk_idraca, fk_idusuario, fk_idstatus) {
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

        if (fk_idraca) {
            const racaCheck = await db.executeQuery('SELECT idraca FROM raca WHERE idraca = ?', [fk_idraca]);
            if (racaCheck.length === 0) {
                throw new Error('Raça não encontrada');
            }
        }

        const updates = [];
        const values = [];
        if (nome) { updates.push('nome = ?'); values.push(nome); }
        if (raca) { updates.push('raca = ?'); values.push(raca); }
        if (foto) { updates.push('foto = ?'); values.push(foto); }
        if (descricao) { updates.push('descricao = ?'); values.push(descricao); }
        if (latitude !== undefined) { updates.push('latitude = ?'); values.push(latitude); }
        if (longitude !== undefined) { updates.push('longitude = ?'); values.push(longitude); }
        if (fk_idraca) { updates.push('fk_idraca = ?'); values.push(fk_idraca); }
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
                a.latitude, a.longitude, a.data_criacao,
                a.fk_idraca, a.fk_idusuario, a.fk_idstatus,
                u.nome as dono_nome,
                s.tipo as status_tipo,
                r.nome as raca_nome,
                t.nome as tipo_nome
            FROM animal a
            LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
            LEFT JOIN status s ON a.fk_idstatus = s.idstatus
            LEFT JOIN raca r ON a.fk_idraca = r.idraca
            LEFT JOIN tipo_animal t ON r.fk_idtipo = t.idtipo
            WHERE s.tipo = ?
        `;
        return await db.executeQuery(query, [status]);
    }

    static async getByTipo(tipo) {
        const query = `
            SELECT 
                a.idAnimal, a.nome, a.raca, a.foto, a.descricao,
                a.latitude, a.longitude, a.data_criacao,
                a.fk_idraca, a.fk_idusuario, a.fk_idstatus,
                u.nome as dono_nome,
                s.tipo as status_tipo,
                r.nome as raca_nome,
                t.nome as tipo_nome
            FROM animal a
            LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
            LEFT JOIN status s ON a.fk_idstatus = s.idstatus
            LEFT JOIN raca r ON a.fk_idraca = r.idraca
            LEFT JOIN tipo_animal t ON r.fk_idtipo = t.idtipo
            WHERE t.nome = ?
        `;
        return await db.executeQuery(query, [tipo]);
    }

    static async getByLocation(latitude, longitude, radius = 10) {
        const query = `
            SELECT 
                a.idAnimal, a.nome, a.raca, a.foto, a.descricao,
                a.latitude, a.longitude, a.data_criacao,
                a.fk_idraca, a.fk_idusuario, a.fk_idstatus,
                u.nome as dono_nome,
                s.tipo as status_tipo,
                r.nome as raca_nome,
                t.nome as tipo_nome,
                (6371 * acos(cos(radians(?)) * cos(radians(a.latitude)) * cos(radians(a.longitude) - radians(?)) + sin(radians(?)) * sin(radians(a.latitude)))) AS distancia
            FROM animal a
            LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
            LEFT JOIN status s ON a.fk_idstatus = s.idstatus
            LEFT JOIN raca r ON a.fk_idraca = r.idraca
            LEFT JOIN tipo_animal t ON r.fk_idtipo = t.idtipo
            HAVING distancia < ?
            ORDER BY distancia
        `;
        return await db.executeQuery(query, [latitude, longitude, latitude, radius]);
    }
}

module.exports = Animal;

