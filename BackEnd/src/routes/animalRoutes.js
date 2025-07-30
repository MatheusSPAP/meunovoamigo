const express = require("express");
const animalController = require("../controllers/animalController");

const router = express.Router();

router.get("/", animalController.getAllAnimais);
router.get("/:id", animalController.getAnimalById);
router.get("/status/:status", animalController.getAnimaisByStatus);
router.get("/tipo/:tipo", animalController.getAnimaisByTipo);
router.get("/localizacao", animalController.getAnimaisByLocation);
router.post("/", animalController.createAnimal);
router.put("/:id", animalController.updateAnimal);
router.delete("/:id", animalController.deleteAnimal);

module.exports = router;


