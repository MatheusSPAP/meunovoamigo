const db = require('./dbMysqlConfig');

class UsuarioDb {

    static async insert(model) {
        const conn = await db.connect();

        const nome = model.nome;
        const telefone = model.telefone;
        const email = model.email;
        const senha = model.senha;
        const cidade = model.cidade;
        const endereco = model.endereco;

        const query = 'INSERT INTO usuario (nome, telefone, email, senha, cidade, endereco) VALUES (?, ?, ?, ?, ?, ?)';

        try {
            const [result] = await conn.execute(query, [nome, telefone, email, senha, cidade, endereco]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectAll() {
        const conn = await db.connect();

        const query = 'SELECT * FROM usuario';
        
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

        const query = 'SELECT * FROM usuario WHERE idusuario = ?';
        
        try {
            const [result] = await conn.execute(query, [id]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByEmail(email) {
        const conn = await db.connect();

        const query = 'SELECT * FROM usuario WHERE email = ?';
        
        try {
            const [result] = await conn.execute(query, [email]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async update(model) {
        const conn = await db.connect();

        const idusuario = model.idusuario;
        const nome = model.nome;
        const telefone = model.telefone;
        const email = model.email;
        const senha = model.senha;
        const cidade = model.cidade;
        const endereco = model.endereco;

        const query = 'UPDATE usuario SET nome = ?, telefone = ?, email = ?, senha = ?, cidade = ?, endereco = ? WHERE idusuario = ?';

        try {
            const [result] = await conn.execute(query, [nome, telefone, email, senha, cidade, endereco, idusuario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM usuario WHERE idusuario = ?';

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

module.exports = UsuarioDb;

