const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/eventoController');

// Rotas para eventos
router.post('/', EventoController.create);                        // POST /eventos - Criar evento
router.get('/', EventoController.getAll);                         // GET /eventos - Listar todos os eventos
router.get('/:id', EventoController.getById);                     // GET /eventos/:id - Buscar evento por ID
router.put('/:id', EventoController.update);                      // PUT /eventos/:id - Atualizar evento
router.delete('/:id', EventoController.delete);                   // DELETE /eventos/:id - Deletar evento

// Rotas especiais para filtros
router.get('/usuario/:idusuario', EventoController.getByUsuario); // GET /eventos/usuario/:idusuario - Buscar eventos por usuário
router.get('/tipo/:tipo', EventoController.getByTipo);            // GET /eventos/tipo/:tipo - Buscar eventos por tipo
router.get('/periodo', EventoController.getByPeriodo);            // GET /eventos/periodo?dataInicio=...&dataFim=... - Buscar eventos por período

module.exports = router;

