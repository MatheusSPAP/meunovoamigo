const UsuarioDb = require('../db/usuarioDb');
const Usuario = require('../models/usuario');

class UsuarioController {

    // Criar novo usuário
    static async create(req, res) {
        try {
            const errors = Usuario.validate(req.body);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            // Verificar se email já existe
            const existingUser = await UsuarioDb.selectByEmail(req.body.email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Email já está em uso'
                });
            }

            const result = await UsuarioDb.insert(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message // Adicionado para depuração
            });
        }
    }

    // Listar todos os usuários
    static async getAll(req, res) {
        try {
            const usuarios = await UsuarioDb.selectAll();
            
            // Remover senhas dos resultados
            const usuariosPublicos = usuarios.map(usuario => {
                const user = Usuario.fromDatabase(usuario);
                return user.toPublic();
            });

            res.status(200).json({
                success: true,
                data: usuariosPublicos
            });

        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Buscar usuário por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await UsuarioDb.selectById(id);

            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            const user = Usuario.fromDatabase(usuario);
            res.status(200).json({
                success: true,
                data: user.toPublic()
            });

        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar usuário
    static async update(req, res) {
        try {
            const { id } = req.params;
            const userData = { ...req.body, idusuario: id };

            const errors = Usuario.validate(userData);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            // Verificar se usuário existe
            const existingUser = await UsuarioDb.selectById(id);
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            // Verificar se email já está em uso por outro usuário
            const userWithEmail = await UsuarioDb.selectByEmail(req.body.email);
            if (userWithEmail && userWithEmail.idusuario != id) {
                return res.status(409).json({
                    success: false,
                    message: 'Email já está em uso'
                });
            }

            await UsuarioDb.update(userData);

            res.status(200).json({
                success: true,
                message: 'Usuário atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Deletar usuário
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se usuário existe
            const existingUser = await UsuarioDb.selectById(id);
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            await UsuarioDb.delete(id);

            res.status(200).json({
                success: true,
                message: 'Usuário deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // Login (buscar por email)
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    success: false,
                    message: 'Email e senha são obrigatórios'
                });
            }

            const usuario = await UsuarioDb.selectByEmail(email);

            if (!usuario || usuario.senha !== senha) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            const user = Usuario.fromDatabase(usuario);
            res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso',
                data: user.toPublic()
            });

        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = UsuarioController;

