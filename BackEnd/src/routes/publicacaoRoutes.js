const express = require("express");
const publicacaoController = require("../controllers/publicacaoController");

const router = express.Router();

router.get("/", publicacaoController.getAllPublicacoes);
router.get("/:id", publicacaoController.getPublicacaoById);
router.get("/usuario/:usuarioId", publicacaoController.getPublicacoesByUsuario);
router.get("/animal/:animalId", publicacaoController.getPublicacoesByAnimal);
router.post("/", publicacaoController.createPublicacao);
router.put("/:id", publicacaoController.updatePublicacao);
router.delete("/:id", publicacaoController.deletePublicacao);

module.exports = router;


