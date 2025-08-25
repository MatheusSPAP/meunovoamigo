const express = require('express');
const router = express.Router();
const MidiaController = require('../controllers/midiaController');
const upload = require('../middleware/upload');

// Rotas para mídias

// POST /midias - Cria uma nova mídia com upload de arquivo
// O middleware 'upload.single('arquivo')' processa o upload do arquivo antes de chamar o controller.
// O nome 'arquivo' deve corresponder ao nome do campo no formulário do frontend.
router.post('/', upload.single('arquivo'), MidiaController.create);

// GET /midias - Lista todas as mídias
router.get('/', MidiaController.getAll);

// GET /midias/:id - Busca uma mídia específica por ID
router.get('/:id', MidiaController.getById);

// PUT /midias/:id - Atualiza uma mídia existente
// Note: A rota PUT foi removida na nova versão, pois a lógica de atualização pode ter sido movida ou alterada.

// DELETE /midias/:id - Deleta uma mídia e o arquivo associado
router.delete('/:id', MidiaController.delete);

// GET /midias/postagem/:idcomunidade - Busca todas as mídias associadas a uma postagem
router.get('/postagem/:idcomunidade', MidiaController.getByPostagem);

// GET /midias/tipo/:tipo - Busca todas as mídias por tipo
// Note: A rota GET /midias/tipo/:tipo foi removida na nova versão.

module.exports = router;

