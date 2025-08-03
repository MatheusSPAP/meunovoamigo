const InteresseAdocaoDb = require('../db/interesseAdocaoDb');
const InteresseAdocao = require('../models/interesseAdocao');

class InteresseAdocaoController {

    // Criar novo interesse de adoção
    static async create(req, res) {
        try {
            const errors = InteresseAdocao.validate(req.body);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await InteresseAdocaoDb.insert(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Interesse de adoção criado com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar interesse de adoção:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Listar todos os interesses de adoção
    static async getAll(req, res) {
        try {
            const interesses = await InteresseAdocaoDb.selectAll();

            res.status(200).json({
                success: true,
                data: interesses
            });

        } catch (error) {
            console.error('Erro ao buscar interesses de adoção:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar interesse de adoção por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const interesse = await InteresseAdocaoDb.selectById(id);

            if (!interesse) {
                return res.status(404).json({
                    success: false,
                    message: 'Interesse de adoção não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: interesse
            });

        } catch (error) {
            console.error('Erro ao buscar interesse de adoção:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar interesses por usuário interessado
    static async getByUsuario(req, res) {
        try {
            const { idusuario } = req.params;
            const interesses = await InteresseAdocaoDb.selectByUsuario(idusuario);

            res.status(200).json({
                success: true,
                data: interesses
            });

        } catch (error) {
            console.error('Erro ao buscar interesses por usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar interesses por animal
    static async getByAnimal(req, res) {
        try {
            const { idAnimal } = req.params;
            const interesses = await InteresseAdocaoDb.selectByAnimal(idAnimal);

            res.status(200).json({
                success: true,
                data: interesses
            });

        } catch (error) {
            console.error('Erro ao buscar interesses por animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar interesses por dono do animal
    static async getByDonoAnimal(req, res) {
        try {
            const { idusuario } = req.params;
            const interesses = await InteresseAdocaoDb.selectByDonoAnimal(idusuario);

            res.status(200).json({
                success: true,
                data: interesses
            });

        } catch (error) {
            console.error('Erro ao buscar interesses por dono do animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar interesses por status
    static async getByStatus(req, res) {
        try {
            const { status } = req.params;
            const interesses = await InteresseAdocaoDb.selectByStatus(status);

            res.status(200).json({
                success: true,
                data: interesses
            });

        } catch (error) {
            console.error('Erro ao buscar interesses por status:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar interesse de adoção
    static async update(req, res) {
        try {
            const { id } = req.params;
            const interesseData = { ...req.body, idinteresse_adocao: id };

            // Validar apenas os campos que podem ser atualizados
            if (!req.body.mensagem || req.body.mensagem.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Mensagem é obrigatória'
                });
            }

            if (!req.body.interesse_status || req.body.interesse_status.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Status do interesse é obrigatório'
                });
            }

            // Verificar se interesse existe
            const existingInteresse = await InteresseAdocaoDb.selectById(id);
            if (!existingInteresse) {
                return res.status(404).json({
                    success: false,
                    message: 'Interesse de adoção não encontrado'
                });
            }

            await InteresseAdocaoDb.update(interesseData);

            res.status(200).json({
                success: true,
                message: 'Interesse de adoção atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar interesse de adoção:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar apenas o status do interesse
    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status || status.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Status é obrigatório'
                });
            }

            const statusPermitidos = ['Aguardando', 'Aprovado', 'Recusado'];
            if (!statusPermitidos.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Status deve ser "Aguardando", "Aprovado" ou "Recusado"'
                });
            }

            // Verificar se interesse existe
            const existingInteresse = await InteresseAdocaoDb.selectById(id);
            if (!existingInteresse) {
                return res.status(404).json({
                    success: false,
                    message: 'Interesse de adoção não encontrado'
                });
            }

            await InteresseAdocaoDb.updateStatus(id, status);

            res.status(200).json({
                success: true,
                message: 'Status do interesse atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar status do interesse:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Deletar interesse de adoção
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se interesse existe
            const existingInteresse = await InteresseAdocaoDb.selectById(id);
            if (!existingInteresse) {
                return res.status(404).json({
                    success: false,
                    message: 'Interesse de adoção não encontrado'
                });
            }

            await InteresseAdocaoDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Interesse de adoção deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar interesse de adoção:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = InteresseAdocaoController;

