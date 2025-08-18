const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

// Rotas para usuários
router.post('/', UsuarioController.create);           // POST /usuarios - Criar usuário
router.get('/', UsuarioController.getAll);            // GET /usuarios - Listar todos os usuários
router.get('/:id', UsuarioController.getById);        // GET /usuarios/:id - Buscar usuário por ID
router.put('/:id', UsuarioController.update);         // PUT /usuarios/:id - Atualizar usuário
router.delete('/:id', UsuarioController.delete);      // DELETE /usuarios/:id - Deletar usuário

// Rota especial para login
router.post('/login', UsuarioController.login);       // POST /usuarios/login - Login

module.exports = router;

