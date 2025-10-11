const RacaDb = require('../db/racaDb');

class RacaController {

    static async getAll(req, res) {
        try {
            const racas = await RacaDb.selectAll();

            res.status(200).json({
                success: true,
                data: racas
            });

        } catch (error) {
            console.error('Erro ao buscar raças:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const raca = await RacaDb.selectById(id);

            if (!raca) {
                return res.status(404).json({
                    success: false,
                    message: 'Raça não encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: raca
            });

        } catch (error) {
            console.error('Erro ao buscar raça:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async create(req, res) {
        try {
            const { tipo_raca } = req.body;

            if (!tipo_raca || tipo_raca.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'O tipo da raça é obrigatório'
                });
            }

            const result = await RacaDb.insert({ tipo_raca });
            
            res.status(201).json({
                success: true,
                message: 'Raça criada com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar raça:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { tipo_raca } = req.body;

            if (!tipo_raca || tipo_raca.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'O tipo da raça é obrigatório'
                });
            }

            const existingRaca = await RacaDb.selectById(id);
            if (!existingRaca) {
                return res.status(404).json({
                    success: false,
                    message: 'Raça não encontrada'
                });
            }

            await RacaDb.update({ idraca: id, tipo_raca });

            res.status(200).json({
                success: true,
                message: 'Raça atualizada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar raça:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getByTipo(req, res) {
        try {
            const { tipoId } = req.params;
            const racas = await RacaDb.selectByTipo(tipoId);

            res.status(200).json({
                success: true,
                data: racas
            });

        } catch (error) {
            console.error('Erro ao buscar raças por tipo:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            const existingRaca = await RacaDb.selectById(id);
            if (!existingRaca) {
                return res.status(404).json({
                    success: false,
                    message: 'Raça não encontrada'
                });
            }

            await RacaDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Raça deletada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar raça:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = RacaController;