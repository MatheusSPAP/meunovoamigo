const express = require('express');
const router = express.Router();
const TipoController = require('../controllers/tipoController');

// Rotas para tipos de animal
router.post('/', TipoController.create);           // POST /tipos - Criar tipo
router.get('/', TipoController.getAll);            // GET /tipos - Listar todos os tipos
router.get('/:id', TipoController.getById);        // GET /tipos/:id - Buscar tipo por ID
router.put('/:id', TipoController.update);         // PUT /tipos/:id - Atualizar tipo
router.delete('/:id', TipoController.delete);      // DELETE /tipos/:id - Deletar tipo

module.exports = router;

