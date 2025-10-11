const express = require('express');
const router = express.Router();
const ComportamentoController = require('../controllers/comportamentoController');

// Rotas para comportamentos
router.post('/', ComportamentoController.create);           // POST /comportamentos - Criar comportamento
router.get('/', ComportamentoController.getAll);            // GET /comportamentos - Listar todos os comportamentos
router.get('/:id', ComportamentoController.getById);        // GET /comportamentos/:id - Buscar comportamento por ID
router.put('/:id', ComportamentoController.update);         // PUT /comportamentos/:id - Atualizar comportamento
router.delete('/:id', ComportamentoController.delete);      // DELETE /comportamentos/:id - Deletar comportamento

module.exports = router;

