const Comentario = require('../models/comentario');

class ComentarioController {
    async getComentariosByPostagem(req, res) {
        try {
            const { postagem_id } = req.query;
            
            if (!postagem_id) {
                return res.status(400).json({ error: 'ID da postagem é obrigatório' });
            }

            const comentarios = await Comentario.getByPostagem(postagem_id);
            res.json(comentarios);
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async createComentario(req, res) {
        try {
            const { fk_idcomunidade, fk_idusuario, mensagem } = req.body;
            
            if (!fk_idcomunidade || !fk_idusuario || !mensagem) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const comentario = await Comentario.create(fk_idcomunidade, fk_idusuario, mensagem);
            res.status(201).json(comentario);
        } catch (error) {
            console.error('Erro ao criar comentário:', error);
            if (error.message === 'Postagem não encontrada' || error.message === 'Usuário não encontrado') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async deleteComentario(req, res) {
        try {
            const { id } = req.params;
            
            const result = await Comentario.delete(id);
            res.json(result);
        } catch (error) {
            console.error('Erro ao deletar comentário:', error);
            if (error.message === 'Comentário não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async updateComentario(req, res) {
        try {
            const { id } = req.params;
            const { mensagem } = req.body;
            
            if (!mensagem) {
                return res.status(400).json({ error: 'Mensagem é obrigatória' });
            }

            const comentario = await Comentario.update(id, mensagem);
            res.json(comentario);
        } catch (error) {
            console.error('Erro ao atualizar comentário:', error);
            if (error.message === 'Comentário não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new ComentarioController();

