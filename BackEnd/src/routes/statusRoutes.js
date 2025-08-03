const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/statusController');

// Rotas para status
router.post('/', StatusController.create);           // POST /status - Criar status
router.get('/', StatusController.getAll);            // GET /status - Listar todos os status
router.get('/:id', StatusController.getById);        // GET /status/:id - Buscar status por ID
router.put('/:id', StatusController.update);         // PUT /status/:id - Atualizar status
router.delete('/:id', StatusController.delete);      // DELETE /status/:id - Deletar status

module.exports = router;

