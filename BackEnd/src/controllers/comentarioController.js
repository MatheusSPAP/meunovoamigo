const ComentarioDb = require('../db/comentarioDb');
const Comentario = require('../models/comentario');

class ComentarioController {

    // Criar novo comentário
    static async create(req, res) {
        try {
            const { fk_idcomunidade, fk_idusuario, mensagem } = req.body;

            const model = {
                fk_idcomunidade,
                fk_idusuario,
                mensagem,
                data_comentario: new Date()
            };

            const errors = Comentario.validate(model);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await ComentarioDb.insert(model);
            
            res.status(201).json({
                success: true,
                message: 'Comentário criado com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar comentário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Listar todos os comentários
    static async getAll(req, res) {
        try {
            const comentarios = await ComentarioDb.selectAll();

            res.status(200).json({
                success: true,
                data: comentarios
            });

        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar comentários por postagem
    static async getByPostagem(req, res) {
        try {
            const { idcomunidade } = req.params;
            const comentarios = await ComentarioDb.selectByPostagem(idcomunidade);

            res.status(200).json({
                success: true,
                data: comentarios
            });

        } catch (error) {
            console.error('Erro ao buscar comentários por postagem:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar comentários por usuário
    static async getByUsuario(req, res) {
        try {
            const { idusuario } = req.params;
            const comentarios = await ComentarioDb.selectByUsuario(idusuario);

            res.status(200).json({
                success: true,
                data: comentarios
            });

        } catch (error) {
            console.error('Erro ao buscar comentários por usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar comentário específico
    static async getById(req, res) {
        try {
            const { idcomunidade, idusuario, id_comentario } = req.params;
            const comentario = await ComentarioDb.selectById(idcomunidade, idusuario, id_comentario);

            if (!comentario) {
                return res.status(404).json({
                    success: false,
                    message: 'Comentário não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: comentario
            });

        } catch (error) {
            console.error('Erro ao buscar comentário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar comentário
    static async update(req, res) {
        try {
            const { idcomunidade, idusuario, id_comentario } = req.params;
            const comentarioData = { 
                ...req.body, 
                fk_idcomunidade: idcomunidade,
                fk_idusuario: idusuario,
                id_comentario: id_comentario
            };

            if (!req.body.mensagem || req.body.mensagem.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Mensagem é obrigatória'
                });
            }

            // Verificar se comentário existe
            const existingComentario = await ComentarioDb.selectById(idcomunidade, idusuario, id_comentario);
            if (!existingComentario) {
                return res.status(404).json({
                    success: false,
                    message: 'Comentário não encontrado'
                });
            }

            await ComentarioDb.update(comentarioData);

            res.status(200).json({
                success: true,
                message: 'Comentário atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar comentário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Deletar comentário
    static async delete(req, res) {
        try {
            const { idcomunidade, idusuario, id_comentario } = req.params;

            // Verificar se comentário existe
            const existingComentario = await ComentarioDb.selectById(idcomunidade, idusuario, id_comentario);
            if (!existingComentario) {
                return res.status(404).json({
                    success: false,
                    message: 'Comentário não encontrado'
                });
            }

            await ComentarioDb.delete(idcomunidade, idusuario, id_comentario);

            res.status(200).json({
                success: true,
                message: 'Comentário deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar comentário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = ComentarioController;

