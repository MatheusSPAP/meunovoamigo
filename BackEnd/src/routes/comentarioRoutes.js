const express = require('express');
const router = express.Router();
const ComentarioController = require('../controllers/comentarioController');

// Rotas para comentários
router.post('/', ComentarioController.create);                                                    // POST /comentarios - Criar comentário
router.get('/', ComentarioController.getAll);                                                     // GET /comentarios - Listar todos os comentários

// Rotas especiais para filtros
router.get('/postagem/:idcomunidade', ComentarioController.getByPostagem);                       // GET /comentarios/postagem/:idcomunidade - Buscar comentários por postagem
router.get('/usuario/:idusuario', ComentarioController.getByUsuario);                            // GET /comentarios/usuario/:idusuario - Buscar comentários por usuário

// Rotas para comentário específico (chave composta)
router.get('/:idcomunidade/:idusuario/:id_comentario', ComentarioController.getById);            // GET /comentarios/:idcomunidade/:idusuario/:id_comentario - Buscar comentário específico
router.put('/:idcomunidade/:idusuario/:id_comentario', ComentarioController.update);             // PUT /comentarios/:idcomunidade/:idusuario/:id_comentario - Atualizar comentário
router.delete('/:idcomunidade/:idusuario/:id_comentario', ComentarioController.delete);          // DELETE /comentarios/:idcomunidade/:idusuario/:id_comentario - Deletar comentário

module.exports = router;

