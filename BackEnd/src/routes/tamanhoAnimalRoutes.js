const express = require('express');
const router = express.Router();
const TamanhoAnimalDb = require('../db/tamanhoAnimalDb');
const TamanhoAnimal = require('../models/tamanhoAnimal');

// Controller simples inline para TamanhoAnimal
class TamanhoAnimalController {
    static async create(req, res) {
        try {
            const errors = TamanhoAnimal.validate(req.body);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await TamanhoAnimalDb.insert(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Tamanho de animal criado com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar tamanho de animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getAll(req, res) {
        try {
            const tamanhos = await TamanhoAnimalDb.selectAll();
            
            const tamanhosObjects = tamanhos.map(tamanho => {
                const tamanhoObj = TamanhoAnimal.fromDatabase(tamanho);
                return tamanhoObj.toObject();
            });

            res.status(200).json({
                success: true,
                data: tamanhosObjects
            });

        } catch (error) {
            console.error('Erro ao buscar tamanhos de animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const tamanho = await TamanhoAnimalDb.selectById(id);

            if (!tamanho) {
                return res.status(404).json({
                    success: false,
                    message: 'Tamanho de animal não encontrado'
                });
            }

            const tamanhoObj = TamanhoAnimal.fromDatabase(tamanho);
            res.status(200).json({
                success: true,
                data: tamanhoObj.toObject()
            });

        } catch (error) {
            console.error('Erro ao buscar tamanho de animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const tamanhoData = { ...req.body, idtamanho_animal: id };

            const errors = TamanhoAnimal.validate(tamanhoData);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const existingTamanho = await TamanhoAnimalDb.selectById(id);
            if (!existingTamanho) {
                return res.status(404).json({
                    success: false,
                    message: 'Tamanho de animal não encontrado'
                });
            }

            await TamanhoAnimalDb.update(tamanhoData);

            res.status(200).json({
                success: true,
                message: 'Tamanho de animal atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar tamanho de animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            const existingTamanho = await TamanhoAnimalDb.selectById(id);
            if (!existingTamanho) {
                return res.status(404).json({
                    success: false,
                    message: 'Tamanho de animal não encontrado'
                });
            }

            await TamanhoAnimalDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Tamanho de animal deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar tamanho de animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

// Rotas para tamanhos de animal
router.post('/', TamanhoAnimalController.create);           // POST /tamanhos - Criar tamanho
router.get('/', TamanhoAnimalController.getAll);            // GET /tamanhos - Listar todos os tamanhos
router.get('/:id', TamanhoAnimalController.getById);        // GET /tamanhos/:id - Buscar tamanho por ID
router.put('/:id', TamanhoAnimalController.update);         // PUT /tamanhos/:id - Atualizar tamanho
router.delete('/:id', TamanhoAnimalController.delete);      // DELETE /tamanhos/:id - Deletar tamanho

module.exports = router;

