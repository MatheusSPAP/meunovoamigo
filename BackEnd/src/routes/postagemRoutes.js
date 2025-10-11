const express = require('express');
const router = express.Router();
const PostagemController = require('../controllers/postagemController');
const upload = require('../middleware/upload');

// Rotas para postagens

// A rota de criação agora usa o middleware de upload para aceitar um arquivo opcional.
router.post('/', upload.single('arquivo'), PostagemController.create);

router.get('/', PostagemController.getAll);
router.get('/:id', PostagemController.getById);
router.put('/:id', PostagemController.update);
router.delete('/:id', PostagemController.delete);

// Rotas especiais para filtros
router.get('/usuario/:idusuario', PostagemController.getByUsuario);
router.get('/animal/:idAnimal', PostagemController.getByAnimal);

module.exports = router;

