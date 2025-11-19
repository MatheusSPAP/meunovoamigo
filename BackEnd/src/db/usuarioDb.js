const db = require('./dbConfig');

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
        
        // Campos permitidos para atualização através deste método
        const allowedFields = ['nome', 'telefone', 'email', 'cidade', 'endereco'];
        const fieldsToUpdate = [];
        const values = [];

        for (const field of allowedFields) {
            if (model[field] !== undefined) {
                fieldsToUpdate.push(`${field} = ?`);
                values.push(model[field]);
            }
        }

        if (fieldsToUpdate.length === 0) {
            conn.release();
            // Retorna um objeto similar ao que o mysql2 retornaria, indicando que nada mudou.
            return { affectedRows: 0, message: 'Nenhum campo para atualizar.' };
        }

        values.push(idusuario); // Adiciona o id para a cláusula WHERE

        const query = `UPDATE usuario SET ${fieldsToUpdate.join(', ')} WHERE idusuario = ?`;

        try {
            const [result] = await conn.execute(query, values);
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

    static async updateUserPassword(id, newPasswordHash) {
        const conn = await db.connect();
        try {
            const query = 'UPDATE usuario SET senha = ? WHERE idusuario = ?';
            await conn.execute(query, [newPasswordHash, id]);
            conn.release();
            return { success: true, message: 'Senha atualizada com sucesso no banco de dados.' };
        } catch (error) {
            conn.release();
            console.error('Erro no banco de dados ao atualizar senha:', error);
            throw error; // Lança o erro para ser tratado pelo controller
        }
    }
}

module.exports = UsuarioDb;

