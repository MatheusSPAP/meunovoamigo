const express = require('express');
const router = express.Router();
const ComportamentoDb = require('../db/comportamentoDb');
const Comportamento = require('../models/comportamento');

// Controller simples inline para Comportamento
class ComportamentoController {
    static async create(req, res) {
        try {
            const errors = Comportamento.validate(req.body);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await ComportamentoDb.insert(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Comportamento criado com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar comportamento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getAll(req, res) {
        try {
            const comportamentos = await ComportamentoDb.selectAll();
            
            const comportamentosObjects = comportamentos.map(comportamento => {
                const comportamentoObj = Comportamento.fromDatabase(comportamento);
                return comportamentoObj.toObject();
            });

            res.status(200).json({
                success: true,
                data: comportamentosObjects
            });

        } catch (error) {
            console.error('Erro ao buscar comportamentos:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const comportamento = await ComportamentoDb.selectById(id);

            if (!comportamento) {
                return res.status(404).json({
                    success: false,
                    message: 'Comportamento não encontrado'
                });
            }

            const comportamentoObj = Comportamento.fromDatabase(comportamento);
            res.status(200).json({
                success: true,
                data: comportamentoObj.toObject()
            });

        } catch (error) {
            console.error('Erro ao buscar comportamento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const comportamentoData = { ...req.body, idcomportamento: id };

            const errors = Comportamento.validate(comportamentoData);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const existingComportamento = await ComportamentoDb.selectById(id);
            if (!existingComportamento) {
                return res.status(404).json({
                    success: false,
                    message: 'Comportamento não encontrado'
                });
            }

            await ComportamentoDb.update(comportamentoData);

            res.status(200).json({
                success: true,
                message: 'Comportamento atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar comportamento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            const existingComportamento = await ComportamentoDb.selectById(id);
            if (!existingComportamento) {
                return res.status(404).json({
                    success: false,
                    message: 'Comportamento não encontrado'
                });
            }

            await ComportamentoDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Comportamento deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar comportamento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

// Rotas para comportamentos
router.post('/', ComportamentoController.create);           // POST /comportamentos - Criar comportamento
router.get('/', ComportamentoController.getAll);            // GET /comportamentos - Listar todos os comportamentos
router.get('/:id', ComportamentoController.getById);        // GET /comportamentos/:id - Buscar comportamento por ID
router.put('/:id', ComportamentoController.update);         // PUT /comportamentos/:id - Atualizar comportamento
router.delete('/:id', ComportamentoController.delete);      // DELETE /comportamentos/:id - Deletar comportamento

module.exports = router;

