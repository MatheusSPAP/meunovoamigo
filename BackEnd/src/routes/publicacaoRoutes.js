const publicacaoController = require("../controllers/publicacaoController");

const publicacaoRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith("/api/publicacoes")) {
            if (method === "GET" && path === "/api/publicacoes") {
                await publicacaoController.getAllPublicacoes(req, res);
            } else if (method === "GET" && req.params.id) {
                await publicacaoController.getPublicacaoById(req, res);
            } else if (method === "GET" && path.startsWith("/api/publicacoes/usuario/")) {
                req.params.usuarioId = path.split("/")[4];
                await publicacaoController.getPublicacoesByUsuario(req, res);
            } else if (method === "GET" && path.startsWith("/api/publicacoes/animal/")) {
                req.params.animalId = path.split("/")[4];
                await publicacaoController.getPublicacoesByAnimal(req, res);
            } else if (method === "POST" && path === "/api/publicacoes") {
                await publicacaoController.createPublicacao(req, res);
            } else if (method === "PUT" && req.params.id) {
                await publicacaoController.updatePublicacao(req, res);
            } else if (method === "DELETE" && req.params.id) {
                await publicacaoController.deletePublicacao(req, res);
            } else {
                res.status(404).json({ error: "Rota não encontrada" });
            }
        }
    }
};

module.exports = publicacaoRoutes;


