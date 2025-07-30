const racaController = require("../controllers/racaController");

const racaRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith("/api/racas")) {
            if (method === "GET" && path === "/api/racas") {
                await racaController.getAllRacas(req, res);
            } else if (method === "GET" && req.params.id) {
                await racaController.getRacaById(req, res);
            } else if (method === "GET" && path.startsWith("/api/racas/tipo/")) {
                req.params.tipoId = path.split("/")[4];
                await racaController.getRacasByTipo(req, res);
            } else if (method === "POST" && path === "/api/racas") {
                await racaController.createRaca(req, res);
            } else if (method === "PUT" && req.params.id) {
                await racaController.updateRaca(req, res);
            } else if (method === "DELETE" && req.params.id) {
                await racaController.deleteRaca(req, res);
            } else {
                res.status(404).json({ error: "Rota não encontrada" });
            }
        }
    }
};

module.exports = racaRoutes;


