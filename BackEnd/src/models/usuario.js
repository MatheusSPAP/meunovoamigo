const db = require("../db/dbConfig");

class Usuario {
    static async getAll() {
        const query = 'SELECT idusuario, nome, email, cidade, endereco FROM usuario';
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = 'SELECT idusuario, nome, email, cidade, endereco FROM usuario WHERE idusuario = ?';
        const usuarios = await db.executeQuery(query, [id]);
        return usuarios.length > 0 ? usuarios[0] : null;
    }

    static async create(nome, email, senha, cidade, endereco) {
        const checkQuery = 'SELECT idusuario FROM usuario WHERE email = ?';
        const existingUser = await db.executeQuery(checkQuery, [email]);
        if (existingUser.length > 0) {
            throw new Error('Email já cadastrado');
        }
        const insertQuery = 'INSERT INTO usuario (nome, email, senha, cidade, endereco) VALUES (?, ?, ?, ?, ?)';
        const result = await db.executeQuery(insertQuery, [nome, email, senha, cidade, endereco]);
        return this.getById(result.insertId);
    }

    static async update(id, nome, email, senha, cidade, endereco) {
        const checkQuery = 'SELECT idusuario FROM usuario WHERE idusuario = ?';
        const existingUser = await db.executeQuery(checkQuery, [id]);
        if (existingUser.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        if (email) {
            const emailCheckQuery = 'SELECT idusuario FROM usuario WHERE email = ? AND idusuario != ?';
            const emailExists = await db.executeQuery(emailCheckQuery, [email, id]);
            if (emailExists.length > 0) {
                throw new Error('Email já cadastrado');
            }
        }

        const updates = [];
        const values = [];
        if (nome) { updates.push('nome = ?'); values.push(nome); }
        if (email) { updates.push('email = ?'); values.push(email); }
        if (senha) { updates.push('senha = ?'); values.push(senha); }
        if (cidade) { updates.push('cidade = ?'); values.push(cidade); }
        if (endereco) { updates.push('endereco = ?'); values.push(endereco); }

        if (updates.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        values.push(id);
        const updateQuery = `UPDATE usuario SET ${updates.join(', ')} WHERE idusuario = ?`;
        await db.executeQuery(updateQuery, values);
        return this.getById(id);
    }

    static async delete(id) {
        const checkQuery = 'SELECT idusuario FROM usuario WHERE idusuario = ?';
        const existingUser = await db.executeQuery(checkQuery, [id]);
        if (existingUser.length === 0) {
            throw new Error('Usuário não encontrado');
        }
        const deleteQuery = 'DELETE FROM usuario WHERE idusuario = ?';
        await db.executeQuery(deleteQuery, [id]);
        return { message: 'Usuário deletado com sucesso' };
    }
}

module.exports = Usuario;


