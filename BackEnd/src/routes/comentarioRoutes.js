const express = require("express");
const comentarioController = require("../controllers/comentarioController");

const router = express.Router();

router.get("/publicacao/:publicacaoId", comentarioController.getComentariosByPublicacao);
router.get("/usuario/:usuarioId", comentarioController.getComentariosByUsuario);
router.post("/", comentarioController.createComentario);
router.put("/:id", comentarioController.updateComentario);
router.delete("/:id", comentarioController.deleteComentario);

module.exports = router;


