const StatusDb = require('../db/statusDb');
const Status = require('../models/status');

class StatusController {

    // Criar novo status
    static async create(req, res) {
        try {
            const errors = Status.validate(req.body);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await StatusDb.insert(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Status criado com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar status:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Listar todos os status
    static async getAll(req, res) {
        try {
            const statusList = await StatusDb.selectAll();
            
            const statusObjects = statusList.map(status => {
                const statusObj = Status.fromDatabase(status);
                return statusObj.toObject();
            });

            res.status(200).json({
                success: true,
                data: statusObjects
            });

        } catch (error) {
            console.error('Erro ao buscar status:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar status por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const status = await StatusDb.selectById(id);

            if (!status) {
                return res.status(404).json({
                    success: false,
                    message: 'Status não encontrado'
                });
            }

            const statusObj = Status.fromDatabase(status);
            res.status(200).json({
                success: true,
                data: statusObj.toObject()
            });

        } catch (error) {
            console.error('Erro ao buscar status:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar status
    static async update(req, res) {
        try {
            const { id } = req.params;
            const statusData = { ...req.body, idstatus: id };

            const errors = Status.validate(statusData);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            // Verificar se status existe
            const existingStatus = await StatusDb.selectById(id);
            if (!existingStatus) {
                return res.status(404).json({
                    success: false,
                    message: 'Status não encontrado'
                });
            }

            await StatusDb.update(statusData);

            res.status(200).json({
                success: true,
                message: 'Status atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Deletar status
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se status existe
            const existingStatus = await StatusDb.selectById(id);
            if (!existingStatus) {
                return res.status(404).json({
                    success: false,
                    message: 'Status não encontrado'
                });
            }

            await StatusDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Status deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar status:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = StatusController;

