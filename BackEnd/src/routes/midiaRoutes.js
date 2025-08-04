const midiaController = require("../controllers/midiaController");

const midiaRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith("/api/midias")) {
            if (method === "GET" && path === "/api/midias") {
                await midiaController.getAllMidias(req, res);
            } else if (method === "GET" && req.params.id) {
                await midiaController.getMidiaById(req, res);
            } else if (method === "GET" && path.startsWith("/api/midias/publicacao/")) {
                req.params.publicacaoId = path.split("/")[4];
                await midiaController.getMidiasByPublicacao(req, res);
            } else if (method === "POST" && path === "/api/midias") {
                await midiaController.createMidia(req, res);
            } else if (method === "PUT" && req.params.id) {
                await midiaController.updateMidia(req, res);
            } else if (method === "DELETE" && req.params.id) {
                await midiaController.deleteMidia(req, res);
            } else if (method === "DELETE" && path.startsWith("/api/midias/publicacao/")) {
                req.params.publicacaoId = path.split("/")[4];
                await midiaController.deleteMidiasByPublicacao(req, res);
            } else {
                res.status(404).json({ error: "Rota não encontrada" });
            }
        }
    }
};

module.exports = midiaRoutes;


