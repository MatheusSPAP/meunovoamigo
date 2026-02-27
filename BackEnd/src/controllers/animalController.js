const AnimalDb = require('../db/animalDb');
const Animal = require('../models/animal');
const fs = require('fs');
const db = require('../db/dbConfig');
const PostagemDb = require('../db/postagemDb');
const Postagem = require('../models/postagem');
const MidiaDb = require('../db/midiaDb');
const Midia = require('../models/midia');

class AnimalController {

    // Criar novo animal
    static async create(req, res) {
        const connection = await db.connect();
        try {
            await connection.beginTransaction();

            // 1. Validar e preparar dados do animal
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'A foto do animal é obrigatória.'
                });
            }

            const animalData = {
                ...req.body,
                foto: req.file.path,
                castrado: /^(true|1)$/i.test(req.body.castrado),
                vacinado: /^(true|1)$/i.test(req.body.vacinado),
                data_cadastro: new Date()
            };

            const animalErrors = Animal.validate(animalData);
            if (animalErrors.length > 0) {
                // Lança um erro para ser pego pelo catch, que fará o rollback
                throw new Error(JSON.stringify({ type: 'animal_validation', errors: animalErrors }));
            }

            // 2. Inserir Animal
            const animalResult = await AnimalDb.insert(animalData, connection);
            const newAnimalId = animalResult.insertId;

            // 3. Gerar e Inserir Postagem automaticamente
            const postagemModel = {
                titulo: `Novo amigo para adoção: Conheça ${animalData.nome}!`,
                descricao: animalData.descricao,
                animal_idAnimal: newAnimalId,
                usuario_idusuario: animalData.fk_idusuario,
                data_postagem: new Date()
            };
            
            const postagemErrors = Postagem.validate(postagemModel);
            if (postagemErrors.length > 0) {
                throw new Error(JSON.stringify({ type: 'postagem_validation', errors: postagemErrors }));
            }

            const postagemResult = await PostagemDb.insert(postagemModel, connection);
            const newPostagemId = postagemResult.insertId;

            // 4. Criar e Inserir Mídia associada à nova Postagem
            const midiaModel = {
                nome_arquivo: req.file.originalname,
                tipo: req.file.mimetype.startsWith('image') ? 'foto' : 'video',
                tamanho: req.file.size,
                caminho: req.file.path,
                data_upload: new Date(),
                postagem_idcomunidade: newPostagemId
            };

            const midiaErrors = Midia.validate(midiaModel);
            if (midiaErrors.length > 0) {
                throw new Error(JSON.stringify({ type: 'midia_validation', errors: midiaErrors }));
            }

            await MidiaDb.insert(midiaModel, connection);

            // 5. Se tudo deu certo, confirma a transação
            await connection.commit();
            
            res.status(201).json({
                success: true,
                message: 'Animal e postagem de divulgação criados com sucesso!',
                data: { id: newAnimalId }
            });

        } catch (error) {
            // Se qualquer erro ocorrer, desfaz a transação
            await connection.rollback();

            // E deleta o arquivo que foi enviado
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            console.error('Erro ao criar animal e postagem:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                errors: [error.message]
            });
        } finally {
            // Libera a conexão com o banco
            connection.release();
        }
    }


    // Listar todos os animais
    static async getAll(req, res) {
        try {
            // Extrai os filtros da query string
            const { tipoId, tamanhoId, racaId, nome, status } = req.query;

            // Monta o objeto de filtros
            const filters = {
                tipoId,
                tamanhoId,
                racaId,
                nome,
                status: status || 'Disponível' // Define 'Disponível' como padrão se nenhum status for passado
            };

            const animais = await AnimalDb.selectAll(filters);

            res.status(200).json({
                success: true,
                data: animais
            });

        } catch (error) {
            console.error('Erro ao buscar animais:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar animal por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const animal = await AnimalDb.selectById(id);

            if (!animal) {
                return res.status(404).json({
                    success: false,
                    message: 'Animal não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: animal
            });

        } catch (error) {
            console.error('Erro ao buscar animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar animais por usuário
    static async getByUsuario(req, res) {
        try {
            const { idusuario } = req.params;
            const animais = await AnimalDb.selectByUsuario(idusuario);

            res.status(200).json({
                success: true,
                data: animais
            });

        } catch (error) {
            console.error('Erro ao buscar animais por usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar animais por status
    static async getByStatus(req, res) {
        try {
            const { idstatus } = req.params;
            const animais = await AnimalDb.selectByStatus(idstatus);

            res.status(200).json({
                success: true,
                data: animais
            });

        } catch (error) {
            console.error('Erro ao buscar animais por status:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar animal
    static async update(req, res) {
        try {
            const { id } = req.params;

            // Converte os campos para booleano antes de validar
            const animalData = {
                ...req.body,
                castrado: /^(true|1)$/i.test(req.body.castrado),
                vacinado: /^(true|1)$/i.test(req.body.vacinado),
                idAnimal: id
            };

            const errors = Animal.validate(animalData);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            // Verificar se animal existe
            const existingAnimal = await AnimalDb.selectById(id);
            if (!existingAnimal) {
                return res.status(404).json({
                    success: false,
                    message: 'Animal não encontrado'
                });
            }

            await AnimalDb.update(animalData);

            res.status(200).json({
                success: true,
                message: 'Animal atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Deletar animal
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se animal existe
            const existingAnimal = await AnimalDb.selectById(id);
            if (!existingAnimal) {
                return res.status(404).json({
                    success: false,
                    message: 'Animal não encontrado'
                });
            }

            await AnimalDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Animal deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar estatísticas de animais
    static async getStats(req, res) {
        try {
            const stats = await AnimalDb.getStats();
            
            const response = {
                adotado: 0,
                disponivel: 0
            };

            stats.forEach(stat => {
                if (stat.tipo.toLowerCase() === 'adotado') {
                    response.adotado = stat.count;
                } else if (stat.tipo.toLowerCase() === 'disponível') {
                    response.disponivel = stat.count;
                }
            });

            res.status(200).json({
                success: true,
                data: response
            });

        } catch (error) {
            console.error('Erro ao buscar estatísticas de animais:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = AnimalController;