const express = require("express");
const statusController = require("../controllers/statusController");

const router = express.Router();

router.get("/", statusController.getAllStatus);
router.get("/:id", statusController.getStatusById);
router.post("/", statusController.createStatus);
router.put("/:id", statusController.updateStatus);
router.delete("/:id", statusController.deleteStatus);

module.exports = router;


