const db = require("../db/dbConfig");

class Usuario {
    static async getAll() {
        const query = 'SELECT idusuario, nome, email, cpf, cidade, endereco, data_criacao FROM usuario';
        return await db.executeQuery(query);
    }

    static async getById(id) {
        const query = 'SELECT idusuario, nome, email, cpf, cidade, endereco, data_criacao FROM usuario WHERE idusuario = ?';
        const usuarios = await db.executeQuery(query, [id]);
        return usuarios.length > 0 ? usuarios[0] : null;
    }

    static async getByEmail(email) {
        const query = 'SELECT idusuario, nome, email, cpf, cidade, endereco, data_criacao FROM usuario WHERE email = ?';
        const usuarios = await db.executeQuery(query, [email]);
        return usuarios.length > 0 ? usuarios[0] : null;
    }

    static async getByCpf(cpf) {
        const query = 'SELECT idusuario, nome, email, cpf, cidade, endereco, data_criacao FROM usuario WHERE cpf = ?';
        const usuarios = await db.executeQuery(query, [cpf]);
        return usuarios.length > 0 ? usuarios[0] : null;
    }

    static async create(nome, email, cpf, senha, cidade, endereco) {
        const checkEmailQuery = 'SELECT idusuario FROM usuario WHERE email = ?';
        const existingEmail = await db.executeQuery(checkEmailQuery, [email]);
        if (existingEmail.length > 0) {
            throw new Error('Email já cadastrado');
        }

        const checkCpfQuery = 'SELECT idusuario FROM usuario WHERE cpf = ?';
        const existingCpf = await db.executeQuery(checkCpfQuery, [cpf]);
        if (existingCpf.length > 0) {
            throw new Error('CPF já cadastrado');
        }

        const insertQuery = 'INSERT INTO usuario (nome, email, cpf, senha, cidade, endereco) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await db.executeQuery(insertQuery, [nome, email, cpf, senha, cidade, endereco]);
        return this.getById(result.insertId);
    }

    static async update(id, nome, email, cpf, senha, cidade, endereco) {
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

        if (cpf) {
            const cpfCheckQuery = 'SELECT idusuario FROM usuario WHERE cpf = ? AND idusuario != ?';
            const cpfExists = await db.executeQuery(cpfCheckQuery, [cpf, id]);
            if (cpfExists.length > 0) {
                throw new Error('CPF já cadastrado');
            }
        }

        const updates = [];
        const values = [];
        if (nome) { updates.push('nome = ?'); values.push(nome); }
        if (email) { updates.push('email = ?'); values.push(email); }
        if (cpf) { updates.push('cpf = ?'); values.push(cpf); }
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

    static async authenticate(email, senha) {
        const query = 'SELECT idusuario, nome, email, cpf, cidade, endereco, data_criacao, senha FROM usuario WHERE email = ?';
        const usuarios = await db.executeQuery(query, [email]);
        if (usuarios.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        const usuario = usuarios[0];
        if (usuario.senha !== senha) {
            throw new Error('Senha incorreta');
        }

        // Remove a senha do retorno
        delete usuario.senha;
        return usuario;
    }
}

module.exports = Usuario;

