const InteresseAdocaoDb = require('../db/interesseAdocaoDb');
const InteresseAdocao = require('../models/interesseAdocao');
const AnimalDb = require('../db/animalDb');
const UsuarioDb = require('../db/usuarioDb');

class InteresseAdocaoController {

    // Criar novo interesse de adoção
    static async create(req, res) {
        try {
            const { mensagem, usuario_idusuario, animal_idAnimal } = req.body;

            // Check for existing interest
            const existingInteresse = await InteresseAdocaoDb.selectByUsuarioAndAnimal(usuario_idusuario, animal_idAnimal);
            if (existingInteresse) {
                return res.status(409).json({
                    success: false,
                    message: 'Você já manifestou interesse neste animal.'
                });
            }

            // 1. Verificar se o animal está disponível para adoção
            const animal = await AnimalDb.selectById(animal_idAnimal);
            if (!animal) {
                return res.status(404).json({
                    success: false,
                    message: 'Animal não encontrado.'
                });
            }
            if (animal.status_tipo !== 'Disponível') {
                return res.status(400).json({
                    success: false,
                    message: 'Este animal não está mais disponível para adoção.'
                });
            }

            // 2. Se estiver disponível, prosseguir com a criação do interesse
            const model = {
                mensagem,
                usuario_idusuario,
                animal_idAnimal,
                interesse_status: 'Aguardando',
                data_interesse: new Date()
            };

            const errors = InteresseAdocao.validate(model);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            await InteresseAdocaoDb.insert(model);

            // 3. Buscar dados do tutor para retornar
            const tutor = await UsuarioDb.selectById(animal.fk_idusuario);
            if (!tutor) {
                return res.status(500).json({ success: false, message: 'Erro crítico: tutor do animal não encontrado.' });
            }
            
            // 4. Retornar sucesso com os dados de contato do tutor
            res.status(201).json({
                success: true,
                message: 'Interesse registrado com sucesso! Abaixo estão os dados para contato.',
                data: {
                    nome: tutor.nome,
                    email: tutor.email,
                    telefone: tutor.telefone
                }
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

    // Aprovar uma adoção
    static async aprovar(req, res) {
        try {
            const { id } = req.params;
            const existingInteresse = await InteresseAdocaoDb.selectById(id);
            if (!existingInteresse) {
                return res.status(404).json({
                    success: false,
                    message: 'Interesse de adoção não encontrado'
                });
            }
            if (existingInteresse.interesse_status !== 'Aguardando') {
                return res.status(400).json({
                    success: false,
                    message: `Não é possível aprovar um interesse com status "${existingInteresse.interesse_status}"`
                });
            }
            const result = await InteresseAdocaoDb.aprovarAdocao(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Erro ao aprovar adoção:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor ao aprovar adoção.',
                error: error.message
            });
        }
    }
}

module.exports = InteresseAdocaoController;