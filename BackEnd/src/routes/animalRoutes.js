const animalController = require("../controllers/animalController");

const animalRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith("/api/animais")) {
            if (method === "GET" && path === "/api/animais") {
                await animalController.getAllAnimais(req, res);
            } else if (method === "GET" && path.startsWith("/api/animais/") && req.params.id) {
                await animalController.getAnimalById(req, res);
            } else if (method === "GET" && path.startsWith("/api/animais/status/")) {
                req.params.status = path.split("/")[4];
                await animalController.getAnimaisByStatus(req, res);
            } else if (method === "GET" && path.startsWith("/api/animais/tipo/")) {
                req.params.tipo = path.split("/")[4];
                await animalController.getAnimaisByTipo(req, res);
            } else if (method === "GET" && path.startsWith("/api/animais/localizacao")) {
                await animalController.getAnimaisByLocation(req, res);
            } else if (method === "POST" && path === "/api/animais") {
                await animalController.createAnimal(req, res);
            } else if (method === "PUT" && path.startsWith("/api/animais/") && req.params.id) {
                await animalController.updateAnimal(req, res);
            } else if (method === "DELETE" && path.startsWith("/api/animais/") && req.params.id) {
                await animalController.deleteAnimal(req, res);
            } else {
                res.status(404).json({ error: "Rota não encontrada" });
            }
        }
    }
};

module.exports = animalRoutes;


