const express = require('express');
const router = express.Router();
const AnimalController = require('../controllers/animalController');
const upload = require('../middleware/upload');

// Rotas para animais
router.post('/', upload.single('foto'), AnimalController.create);
router.get('/', AnimalController.getAll);
router.get('/:id', AnimalController.getById);
router.put('/:id', AnimalController.update);
router.delete('/:id', AnimalController.delete);

// Rotas especiais para filtros
router.get('/usuario/:idusuario', AnimalController.getByUsuario);
router.get('/status/:idstatus', AnimalController.getByStatus);

module.exports = router;

