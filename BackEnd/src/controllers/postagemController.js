const PostagemDb = require('../db/postagemDb');
const Postagem = require('../models/postagem');

class PostagemController {

    // Criar nova postagem
    static async create(req, res) {
        try {
            const { titulo, descricao, animal_idAnimal, usuario_idusuario } = req.body;

            const model = {
                titulo,
                descricao,
                animal_idAnimal: animal_idAnimal || null, // Garante que seja nulo se não for enviado
                usuario_idusuario,
                data_postagem: new Date()
            };

            const errors = Postagem.validate(model);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await PostagemDb.insert(model);
            
            res.status(201).json({
                success: true,
                message: 'Postagem criada com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar postagem:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Listar todas as postagens
    static async getAll(req, res) {
        try {
            const postagens = await PostagemDb.selectAll();

            res.status(200).json({
                success: true,
                data: postagens
            });

        } catch (error) {
            console.error('Erro ao buscar postagens:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar postagem por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const postagem = await PostagemDb.selectById(id);

            if (!postagem) {
                return res.status(404).json({
                    success: false,
                    message: 'Postagem não encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: postagem
            });

        } catch (error) {
            console.error('Erro ao buscar postagem:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar postagens por usuário
    static async getByUsuario(req, res) {
        try {
            const { idusuario } = req.params;
            const postagens = await PostagemDb.selectByUsuario(idusuario);

            res.status(200).json({
                success: true,
                data: postagens
            });

        } catch (error) {
            console.error('Erro ao buscar postagens por usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar postagens por animal
    static async getByAnimal(req, res) {
        try {
            const { idAnimal } = req.params;
            const postagens = await PostagemDb.selectByAnimal(idAnimal);

            res.status(200).json({
                success: true,
                data: postagens
            });

        } catch (error) {
            console.error('Erro ao buscar postagens por animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar postagem
    static async update(req, res) {
        try {
            const { id } = req.params;
            const postagemData = { ...req.body, idcomunidade: id };

            // Validar apenas os campos que podem ser atualizados
            if (!req.body.descricao || req.body.descricao.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Descrição é obrigatória'
                });
            }

            if (!req.body.titulo || req.body.titulo.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Título é obrigatório'
                });
            }

            // Verificar se postagem existe
            const existingPostagem = await PostagemDb.selectById(id);
            if (!existingPostagem) {
                return res.status(404).json({
                    success: false,
                    message: 'Postagem não encontrada'
                });
            }

            await PostagemDb.update(postagemData);

            res.status(200).json({
                success: true,
                message: 'Postagem atualizada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar postagem:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Deletar postagem
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se postagem existe
            const existingPostagem = await PostagemDb.selectById(id);
            if (!existingPostagem) {
                return res.status(404).json({
                    success: false,
                    message: 'Postagem não encontrada'
                });
            }

            await PostagemDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Postagem deletada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar postagem:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = PostagemController;

