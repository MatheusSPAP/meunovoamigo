const AnimalDb = require('../db/animalDb');
const Animal = require('../models/animal');

class AnimalController {

    // Criar novo animal
    static async create(req, res) {
        try {
            // Cria um novo objeto com os dados do request e a data de cadastro gerada pelo servidor
            const animalData = {
                ...req.body,
                castrado: /^(true|1)$/i.test(req.body.castrado),
                vacinado: /^(true|1)$/i.test(req.body.vacinado),
                data_cadastro: new Date()
            };

            const errors = Animal.validate(animalData);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await AnimalDb.insert(animalData);
            
            res.status(201).json({
                success: true,
                message: 'Animal criado com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar animal:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Listar todos os animais
    static async getAll(req, res) {
        try {
            const animais = await AnimalDb.selectAll();

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
}

module.exports = AnimalController;

