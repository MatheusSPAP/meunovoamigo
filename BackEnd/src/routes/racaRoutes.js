const express = require('express');
const router = express.Router();
const RacaController = require('../controllers/racaController');

// Rotas para raças
router.get('/', RacaController.getAll);
router.get('/:id', RacaController.getById);
router.post('/', RacaController.create);
router.put('/:id', RacaController.update);
router.delete('/:id', RacaController.delete);

router.get('/tipo/:tipoId', RacaController.getByTipo);

module.exports = router;