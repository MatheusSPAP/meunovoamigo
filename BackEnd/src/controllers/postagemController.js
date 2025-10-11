const PostagemDb = require('../db/postagemDb');
const Postagem = require('../models/postagem');
const MidiaDb = require('../db/midiaDb');
const Midia = require('../models/midia');
const db = require('../db/dbConfig');
const fs = require('fs');

class PostagemController {

    static async create(req, res) {
        const connection = await db.connect();
        try {
            await connection.beginTransaction();

            // 1. Criar a postagem
            const { titulo, descricao, animal_idAnimal, usuario_idusuario } = req.body;
            const postagemModel = {
                titulo,
                descricao,
                animal_idAnimal: animal_idAnimal || null,
                usuario_idusuario,
                data_postagem: new Date()
            };

            const postagemErrors = Postagem.validate(postagemModel);
            if (postagemErrors.length > 0) {
                throw new Error(JSON.stringify(postagemErrors));
            }

            const postagemResult = await PostagemDb.insert(postagemModel, connection);
            const newPostagemId = postagemResult.insertId;

            // 2. Se houver arquivo, criar a mídia associada
            if (req.file) {
                const midiaModel = {
                    nome_arquivo: req.file.originalname,
                    tipo: req.file.mimetype.startsWith('image') ? 'foto' : 'video',
                    tamanho: req.file.size,
                    caminho: req.file.path,
                    data_upload: new Date(),
                    postagem_idcomunidade: newPostagemId
                };

                const midiaErrors = Midia.validate(midiaModel);
                if (midiaErrors.length > 0) {
                    throw new Error(JSON.stringify(midiaErrors));
                }

                await MidiaDb.insert(midiaModel, connection);
            }

            await connection.commit();
            
            res.status(201).json({
                success: true,
                message: 'Postagem criada com sucesso',
                data: { id: newPostagemId }
            });

        } catch (error) {
            await connection.rollback();

            // Se um arquivo foi enviado, ele deve ser removido em caso de erro
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            console.error('Erro ao criar postagem:', error);

            let errorMessages = [];
            if (error.message) {
                try {
                    // Tenta fazer o parse, caso o erro seja uma string JSON de validação
                    errorMessages = JSON.parse(error.message);
                } catch (e) {
                    // Se não for JSON, usa a mensagem de erro diretamente
                    errorMessages = [error.message];
                }
            }

            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                errors: errorMessages
            });
        } finally {
            connection.release();
        }
    }

    // ... (outros métodos permanecem os mesmos)
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

    static async update(req, res) {
        try {
            const { id } = req.params;
            const postagemData = { ...req.body, idcomunidade: id };
            if (!req.body.descricao || req.body.descricao.trim() === '' || !req.body.titulo || req.body.titulo.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Título e Descrição são obrigatórios'
                });
            }
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

    static async delete(req, res) {
        // Nota: Este método de delete ainda não remove as mídias associadas do sistema de arquivos.
        // Para uma implementação completa, seria necessário buscar as mídias, deletar os arquivos e depois deletar os registros.
        try {
            const { id } = req.params;
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