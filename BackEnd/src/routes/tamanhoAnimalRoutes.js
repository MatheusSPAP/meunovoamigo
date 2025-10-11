const express = require('express');
const router = express.Router();
const TamanhoAnimalController = require('../controllers/tamanhoAnimalController');

// Rotas para tamanhos de animal
router.post('/', TamanhoAnimalController.create);           // POST /tamanhos - Criar tamanho
router.get('/', TamanhoAnimalController.getAll);            // GET /tamanhos - Listar todos os tamanhos
router.get('/:id', TamanhoAnimalController.getById);        // GET /tamanhos/:id - Buscar tamanho por ID
router.put('/:id', TamanhoAnimalController.update);         // PUT /tamanhos/:id - Atualizar tamanho
router.delete('/:id', TamanhoAnimalController.delete);      // DELETE /tamanhos/:id - Deletar tamanho

module.exports = router;

