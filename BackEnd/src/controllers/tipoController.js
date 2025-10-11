const TipoDb = require('../db/tipoDb');
const Tipo = require('../models/tipo');

class TipoController {
    static async create(req, res) {
        try {
            const errors = Tipo.validate(req.body);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await TipoDb.insert(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Tipo criado com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar tipo:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getAll(req, res) {
        try {
            const tipos = await TipoDb.selectAll();
            
            const tiposObjects = tipos.map(tipo => {
                const tipoObj = Tipo.fromDatabase(tipo);
                return tipoObj.toObject();
            });

            res.status(200).json({
                success: true,
                data: tiposObjects
            });

        } catch (error) {
            console.error('Erro ao buscar tipos:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const tipo = await TipoDb.selectById(id);

            if (!tipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo não encontrado'
                });
            }

            const tipoObj = Tipo.fromDatabase(tipo);
            res.status(200).json({
                success: true,
                data: tipoObj.toObject()
            });

        } catch (error) {
            console.error('Erro ao buscar tipo:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const tipoData = { ...req.body, idtipo_animal: id };

            const errors = Tipo.validate(tipoData);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const existingTipo = await TipoDb.selectById(id);
            if (!existingTipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo não encontrado'
                });
            }

            await TipoDb.update(tipoData);

            res.status(200).json({
                success: true,
                message: 'Tipo atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar tipo:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            const existingTipo = await TipoDb.selectById(id);
            if (!existingTipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo não encontrado'
                });
            }

            await TipoDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Tipo deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar tipo:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = TipoController;
