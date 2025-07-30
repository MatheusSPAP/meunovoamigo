const tipoAnimalController = require("../controllers/tipoAnimalController");

const tipoAnimalRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith("/api/tipos-animais")) {
            if (method === "GET" && path === "/api/tipos-animais") {
                await tipoAnimalController.getAllTipos(req, res);
            } else if (method === "GET" && req.params.id) {
                await tipoAnimalController.getTipoById(req, res);
            } else if (method === "POST" && path === "/api/tipos-animais") {
                await tipoAnimalController.createTipo(req, res);
            } else if (method === "PUT" && req.params.id) {
                await tipoAnimalController.updateTipo(req, res);
            } else if (method === "DELETE" && req.params.id) {
                await tipoAnimalController.deleteTipo(req, res);
            } else {
                res.status(404).json({ error: "Rota não encontrada" });
            }
        }
    }
};

module.exports = tipoAnimalRoutes;


