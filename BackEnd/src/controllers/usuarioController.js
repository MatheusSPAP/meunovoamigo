const Usuario = require('../models/usuario');

class UsuarioController {
    async getAllUsuarios(req, res) {
        try {
            const usuarios = await Usuario.getAll();
            res.json(usuarios);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getUsuarioById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.getById(id);
            
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            res.json(usuario);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async createUsuario(req, res) {
        try {
            const { nome, email, senha, cidade, endereco } = req.body;
            
            if (!nome || !email || !senha || !cidade || !endereco) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const usuario = await Usuario.create(nome, email, senha, cidade, endereco);
            res.status(201).json(usuario);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            if (error.message === 'Email já cadastrado') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async updateUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, cidade, endereco } = req.body;
            
            const usuario = await Usuario.update(id, nome, email, senha, cidade, endereco);
            res.json(usuario);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            if (error.message === 'Usuário não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Email já cadastrado' || error.message === 'Nenhum campo para atualizar') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async deleteUsuario(req, res) {
        try {
            const { id } = req.params;
            
            const result = await Usuario.delete(id);
            res.json(result);
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            if (error.message === 'Usuário não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new UsuarioController();

