const express = require("express");
const racaController = require("../controllers/racaController");

const router = express.Router();

router.get("/", racaController.getAllRacas);
router.get("/:id", racaController.getRacaById);
router.get("/tipo/:tipoId", racaController.getRacasByTipo);
router.post("/", racaController.createRaca);
router.put("/:id", racaController.updateRaca);
router.delete("/:id", racaController.deleteRaca);

module.exports = router;


