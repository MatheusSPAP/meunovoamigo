const express = require("express");
const midiaController = require("../controllers/midiaController");

const router = express.Router();

router.get("/", midiaController.getAllMidias);
router.get("/:id", midiaController.getMidiaById);
router.get("/publicacao/:publicacaoId", midiaController.getMidiasByPublicacao);
router.post("/", midiaController.createMidia);
router.put("/:id", midiaController.updateMidia);
router.delete("/:id", midiaController.deleteMidia);
router.delete("/publicacao/:publicacaoId", midiaController.deleteMidiasByPublicacao);

module.exports = router;


