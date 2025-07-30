const express = require("express");
const eventoController = require("../controllers/eventoController");

const router = express.Router();

router.get("/", eventoController.getAllEventos);
router.get("/:id", eventoController.getEventoById);
router.get("/usuario/:usuarioId", eventoController.getEventosByUsuario);
router.get("/tipo/:tipo", eventoController.getEventosByTipo);
router.get("/proximos", eventoController.getProximosEventos);
router.post("/", eventoController.createEvento);
router.put("/:id", eventoController.updateEvento);
router.delete("/:id", eventoController.deleteEvento);

module.exports = router;


