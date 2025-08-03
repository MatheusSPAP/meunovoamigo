const express = require('express');
const router = express.Router();
const InteresseAdocaoController = require('../controllers/interesseAdocaoController');

// Rotas para interesses de adoção
router.post('/', InteresseAdocaoController.create);                                    // POST /interesses-adocao - Criar interesse de adoção
router.get('/', InteresseAdocaoController.getAll);                                     // GET /interesses-adocao - Listar todos os interesses
router.get('/:id', InteresseAdocaoController.getById);                                 // GET /interesses-adocao/:id - Buscar interesse por ID
router.put('/:id', InteresseAdocaoController.update);                                  // PUT /interesses-adocao/:id - Atualizar interesse
router.delete('/:id', InteresseAdocaoController.delete);                               // DELETE /interesses-adocao/:id - Deletar interesse

// Rotas especiais para filtros
router.get('/usuario/:idusuario', InteresseAdocaoController.getByUsuario);             // GET /interesses-adocao/usuario/:idusuario - Buscar interesses por usuário interessado
router.get('/animal/:idAnimal', InteresseAdocaoController.getByAnimal);                // GET /interesses-adocao/animal/:idAnimal - Buscar interesses por animal
router.get('/dono/:idusuario', InteresseAdocaoController.getByDonoAnimal);             // GET /interesses-adocao/dono/:idusuario - Buscar interesses por dono do animal
router.get('/status/:status', InteresseAdocaoController.getByStatus);                  // GET /interesses-adocao/status/:status - Buscar interesses por status

// Rota especial para atualizar apenas o status
router.patch('/:id/status', InteresseAdocaoController.updateStatus);                   // PATCH /interesses-adocao/:id/status - Atualizar apenas o status

module.exports = router;

