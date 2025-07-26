const Status = require('../models/status');

class StatusController {
    async getAllStatus(req, res) {
        try {
            const status = await Status.getAll();
            res.json(status);
        } catch (error) {
            console.error('Erro ao buscar status:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getStatusById(req, res) {
        try {
            const { id } = req.params;
            const status = await Status.getById(id);
            
            if (!status) {
                return res.status(404).json({ error: 'Status não encontrado' });
            }
            
            res.json(status);
        } catch (error) {
            console.error('Erro ao buscar status:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async createStatus(req, res) {
        try {
            const { tipo } = req.body;
            
            if (!tipo) {
                return res.status(400).json({ error: 'Campo tipo é obrigatório' });
            }

            const status = await Status.create(tipo);
            res.status(201).json(status);
        } catch (error) {
            console.error('Erro ao criar status:', error);
            if (error.message === 'Tipo de status já existe') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { tipo } = req.body;
            
            if (!tipo) {
                return res.status(400).json({ error: 'Campo tipo é obrigatório' });
            }

            const status = await Status.update(id, tipo);
            res.json(status);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            if (error.message === 'Status não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Tipo de status já existe') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async deleteStatus(req, res) {
        try {
            const { id } = req.params;
            
            const result = await Status.delete(id);
            res.json(result);
        } catch (error) {
            console.error('Erro ao deletar status:', error);
            if (error.message === 'Status não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Não é possível deletar status que está sendo usado por animais') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new StatusController();

