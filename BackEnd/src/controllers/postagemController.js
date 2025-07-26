const Postagem = require('../models/postagem');

class PostagemController {
    async getAllPostagens(req, res) {
        try {
            const postagens = await Postagem.getAll();
            res.json(postagens);
        } catch (error) {
            console.error('Erro ao buscar postagens:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getPostagemById(req, res) {
        try {
            const { id } = req.params;
            const postagem = await Postagem.getById(id);
            
            if (!postagem) {
                return res.status(404).json({ error: 'Postagem não encontrada' });
            }
            
            res.json(postagem);
        } catch (error) {
            console.error('Erro ao buscar postagem:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async createPostagem(req, res) {
        try {
            const { descricao, comunidadecol, titulo, animal_idAnimal, usuario_idusuario } = req.body;
            
            if (!descricao || !comunidadecol || !titulo || !animal_idAnimal || !usuario_idusuario) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const postagem = await Postagem.create(descricao, comunidadecol, titulo, animal_idAnimal, usuario_idusuario);
            res.status(201).json(postagem);
        } catch (error) {
            console.error('Erro ao criar postagem:', error);
            if (error.message === 'Usuário não encontrado' || error.message === 'Animal não encontrado') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async updatePostagem(req, res) {
        try {
            const { id } = req.params;
            const { descricao, comunidadecol, titulo } = req.body;
            
            const postagem = await Postagem.update(id, descricao, comunidadecol, titulo);
            res.json(postagem);
        } catch (error) {
            console.error('Erro ao atualizar postagem:', error);
            if (error.message === 'Postagem não encontrada') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Nenhum campo para atualizar') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async deletePostagem(req, res) {
        try {
            const { id } = req.params;
            
            const result = await Postagem.delete(id);
            res.json(result);
        } catch (error) {
            console.error('Erro ao deletar postagem:', error);
            if (error.message === 'Postagem não encontrada') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new PostagemController();

