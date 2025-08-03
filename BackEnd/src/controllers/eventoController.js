const EventoDb = require('../db/eventoDb');
const Evento = require('../models/evento');

class EventoController {

    // Criar novo evento
    static async create(req, res) {
        try {
            const errors = Evento.validate(req.body);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await EventoDb.insert(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Evento criado com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar evento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Listar todos os eventos
    static async getAll(req, res) {
        try {
            const eventos = await EventoDb.selectAll();

            res.status(200).json({
                success: true,
                data: eventos
            });

        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar evento por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const evento = await EventoDb.selectById(id);

            if (!evento) {
                return res.status(404).json({
                    success: false,
                    message: 'Evento não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: evento
            });

        } catch (error) {
            console.error('Erro ao buscar evento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar eventos por usuário
    static async getByUsuario(req, res) {
        try {
            const { idusuario } = req.params;
            const eventos = await EventoDb.selectByUsuario(idusuario);

            res.status(200).json({
                success: true,
                data: eventos
            });

        } catch (error) {
            console.error('Erro ao buscar eventos por usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar eventos por tipo
    static async getByTipo(req, res) {
        try {
            const { tipo } = req.params;
            const eventos = await EventoDb.selectByTipo(tipo);

            res.status(200).json({
                success: true,
                data: eventos
            });

        } catch (error) {
            console.error('Erro ao buscar eventos por tipo:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar eventos por período
    static async getByPeriodo(req, res) {
        try {
            const { dataInicio, dataFim } = req.query;

            if (!dataInicio || !dataFim) {
                return res.status(400).json({
                    success: false,
                    message: 'Data de início e fim são obrigatórias'
                });
            }

            const eventos = await EventoDb.selectByData(dataInicio, dataFim);

            res.status(200).json({
                success: true,
                data: eventos
            });

        } catch (error) {
            console.error('Erro ao buscar eventos por período:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar evento
    static async update(req, res) {
        try {
            const { id } = req.params;
            const eventoData = { ...req.body, idEvento: id };

            const errors = Evento.validate(eventoData);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            // Verificar se evento existe
            const existingEvento = await EventoDb.selectById(id);
            if (!existingEvento) {
                return res.status(404).json({
                    success: false,
                    message: 'Evento não encontrado'
                });
            }

            await EventoDb.update(eventoData);

            res.status(200).json({
                success: true,
                message: 'Evento atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Deletar evento
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se evento existe
            const existingEvento = await EventoDb.selectById(id);
            if (!existingEvento) {
                return res.status(404).json({
                    success: false,
                    message: 'Evento não encontrado'
                });
            }

            await EventoDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Evento deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar evento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = EventoController;

