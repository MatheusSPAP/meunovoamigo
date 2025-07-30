const comentarioController = require("../controllers/comentarioController");

const comentarioRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith("/api/comentarios")) {
            if (method === "GET" && path.startsWith("/api/comentarios/publicacao/") && req.params.publicacaoId) {
                await comentarioController.getComentariosByPublicacao(req, res);
            } else if (method === "GET" && path.startsWith("/api/comentarios/usuario/") && req.params.usuarioId) {
                await comentarioController.getComentariosByUsuario(req, res);
            } else if (method === "POST" && path === "/api/comentarios") {
                await comentarioController.createComentario(req, res);
            } else if (method === "PUT" && req.params.id) {
                await comentarioController.updateComentario(req, res);
            } else if (method === "DELETE" && req.params.id) {
                await comentarioController.deleteComentario(req, res);
            } else {
                res.status(404).json({ error: "Rota não encontrada" });
            }
        }
    }
};

module.exports = comentarioRoutes;


