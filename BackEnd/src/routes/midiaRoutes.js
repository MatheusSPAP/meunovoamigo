const express = require('express');
const router = express.Router();
const MidiaDb = require('../db/midiaDb');
const Midia = require('../models/midia');

// Controller simples inline para Midia
class MidiaController {
    static async create(req, res) {
        try {
            const errors = Midia.validate(req.body);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await MidiaDb.insert(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Mídia criada com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar mídia:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getAll(req, res) {
        try {
            const midias = await MidiaDb.selectAll();

            res.status(200).json({
                success: true,
                data: midias
            });

        } catch (error) {
            console.error('Erro ao buscar mídias:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const midia = await MidiaDb.selectById(id);

            if (!midia) {
                return res.status(404).json({
                    success: false,
                    message: 'Mídia não encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: midia
            });

        } catch (error) {
            console.error('Erro ao buscar mídia:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getByPostagem(req, res) {
        try {
            const { idcomunidade } = req.params;
            const midias = await MidiaDb.selectByPostagem(idcomunidade);

            res.status(200).json({
                success: true,
                data: midias
            });

        } catch (error) {
            console.error('Erro ao buscar mídias por postagem:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getByTipo(req, res) {
        try {
            const { tipo } = req.params;
            const midias = await MidiaDb.selectByTipo(tipo);

            res.status(200).json({
                success: true,
                data: midias
            });

        } catch (error) {
            console.error('Erro ao buscar mídias por tipo:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const midiaData = { ...req.body, idmidia: id };

            // Validar apenas os campos que podem ser atualizados
            if (!req.body.nome_arquivo || req.body.nome_arquivo.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Nome do arquivo é obrigatório'
                });
            }

            const existingMidia = await MidiaDb.selectById(id);
            if (!existingMidia) {
                return res.status(404).json({
                    success: false,
                    message: 'Mídia não encontrada'
                });
            }

            await MidiaDb.update(midiaData);

            res.status(200).json({
                success: true,
                message: 'Mídia atualizada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar mídia:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            const existingMidia = await MidiaDb.selectById(id);
            if (!existingMidia) {
                return res.status(404).json({
                    success: false,
                    message: 'Mídia não encontrada'
                });
            }

            await MidiaDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Mídia deletada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar mídia:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

// Rotas para mídias
router.post('/', MidiaController.create);                        // POST /midias - Criar mídia
router.get('/', MidiaController.getAll);                         // GET /midias - Listar todas as mídias
router.get('/:id', MidiaController.getById);                     // GET /midias/:id - Buscar mídia por ID
router.put('/:id', MidiaController.update);                      // PUT /midias/:id - Atualizar mídia
router.delete('/:id', MidiaController.delete);                   // DELETE /midias/:id - Deletar mídia

// Rotas especiais para filtros
router.get('/postagem/:idcomunidade', MidiaController.getByPostagem); // GET /midias/postagem/:idcomunidade - Buscar mídias por postagem
router.get('/tipo/:tipo', MidiaController.getByTipo);                  // GET /midias/tipo/:tipo - Buscar mídias por tipo

module.exports = router;

