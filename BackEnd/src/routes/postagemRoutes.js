const express = require('express');
const router = express.Router();
const PostagemController = require('../controllers/postagemController');

// Rotas para postagens
router.post('/', PostagemController.create);                        // POST /postagens - Criar postagem
router.get('/', PostagemController.getAll);                         // GET /postagens - Listar todas as postagens
router.get('/:id', PostagemController.getById);                     // GET /postagens/:id - Buscar postagem por ID
router.put('/:id', PostagemController.update);                      // PUT /postagens/:id - Atualizar postagem
router.delete('/:id', PostagemController.delete);                   // DELETE /postagens/:id - Deletar postagem

// Rotas especiais para filtros
router.get('/usuario/:idusuario', PostagemController.getByUsuario); // GET /postagens/usuario/:idusuario - Buscar postagens por usuário
router.get('/animal/:idAnimal', PostagemController.getByAnimal);    // GET /postagens/animal/:idAnimal - Buscar postagens por animal

module.exports = router;

