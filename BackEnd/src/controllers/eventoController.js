const Evento = require('../models/evento');

class EventoController {
    async getAllEventos(req, res) {
        try {
            const eventos = await Evento.getAll();
            res.json(eventos);
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getEventoById(req, res) {
        try {
            const { id } = req.params;
            const evento = await Evento.getById(id);
            
            if (!evento) {
                return res.status(404).json({ error: 'Evento não encontrado' });
            }
            
            res.json(evento);
        } catch (error) {
            console.error('Erro ao buscar evento:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async createEvento(req, res) {
        try {
            const { tipo_evento, data, endereco, descricao, fk_idusuario } = req.body;
            
            if (!tipo_evento || !data || !endereco || !descricao || !fk_idusuario) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const evento = await Evento.create(tipo_evento, data, endereco, descricao, fk_idusuario);
            res.status(201).json(evento);
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            if (error.message === 'Usuário não encontrado') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async updateEvento(req, res) {
        try {
            const { id } = req.params;
            const { tipo_evento, data, endereco, descricao, fk_idusuario } = req.body;
            
            const evento = await Evento.update(id, tipo_evento, data, endereco, descricao, fk_idusuario);
            res.json(evento);
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            if (error.message === 'Evento não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Usuário não encontrado' || error.message === 'Nenhum campo para atualizar') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async deleteEvento(req, res) {
        try {
            const { id } = req.params;
            
            const result = await Evento.delete(id);
            res.json(result);
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
            if (error.message === 'Evento não encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new EventoController();

