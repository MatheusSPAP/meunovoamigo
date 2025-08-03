const express = require('express');
const router = express.Router();
const AnimalController = require('../controllers/animalController');

// Rotas para animais
router.post('/', AnimalController.create);                        // POST /animais - Criar animal
router.get('/', AnimalController.getAll);                         // GET /animais - Listar todos os animais
router.get('/:id', AnimalController.getById);                     // GET /animais/:id - Buscar animal por ID
router.put('/:id', AnimalController.update);                      // PUT /animais/:id - Atualizar animal
router.delete('/:id', AnimalController.delete);                   // DELETE /animais/:id - Deletar animal

// Rotas especiais para filtros
router.get('/usuario/:idusuario', AnimalController.getByUsuario); // GET /animais/usuario/:idusuario - Buscar animais por usuário
router.get('/status/:idstatus', AnimalController.getByStatus);    // GET /animais/status/:idstatus - Buscar animais por status

module.exports = router;

