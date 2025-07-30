const express = require("express");
const tipoAnimalController = require("../controllers/tipoAnimalController");

const router = express.Router();

router.get("/", tipoAnimalController.getAllTipos);
router.get("/:id", tipoAnimalController.getTipoById);
router.post("/", tipoAnimalController.createTipo);
router.put("/:id", tipoAnimalController.updateTipo);
router.delete("/:id", tipoAnimalController.deleteTipo);

module.exports = router;


