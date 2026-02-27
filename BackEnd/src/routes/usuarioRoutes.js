const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas públicas (não exigem autenticação)
router.post('/login', UsuarioController.login);       // POST /usuarios/login - Login
router.post('/', UsuarioController.create);           // POST /usuarios - Criar usuário

// Rotas protegidas (exigem autenticação via token JWT)
router.get('/', authMiddleware, UsuarioController.getAll);            // GET /usuarios - Listar todos os usuários
router.get('/:id', authMiddleware, UsuarioController.getById);        // GET /usuarios/:id - Buscar usuário por ID
router.put('/:id', authMiddleware, UsuarioController.update);         // PUT /usuarios/:id - Atualizar usuário
router.delete('/:id', authMiddleware, UsuarioController.delete);      // DELETE /usuarios/:id - Deletar usuário
router.patch('/:id/password', authMiddleware, UsuarioController.updateUserPassword); // PATCH /usuarios/:id/password - Atualizar senha

module.exports = router;

