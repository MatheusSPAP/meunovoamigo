const eventoController = require("../controllers/eventoController");

const eventoRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith("/api/eventos")) {
            if (method === "GET" && path === "/api/eventos") {
                await eventoController.getAllEventos(req, res);
            } else if (method === "GET" && req.params.id) {
                await eventoController.getEventoById(req, res);
            } else if (method === "GET" && path.startsWith("/api/eventos/usuario/")) {
                req.params.usuarioId = path.split("/")[4];
                await eventoController.getEventosByUsuario(req, res);
            } else if (method === "GET" && path.startsWith("/api/eventos/tipo/")) {
                req.params.tipo = path.split("/")[4];
                await eventoController.getEventosByTipo(req, res);
            } else if (method === "GET" && path === "/api/eventos/proximos") {
                await eventoController.getProximosEventos(req, res);
            } else if (method === "POST" && path === "/api/eventos") {
                await eventoController.createEvento(req, res);
            } else if (method === "PUT" && req.params.id) {
                await eventoController.updateEvento(req, res);
            } else if (method === "DELETE" && req.params.id) {
                await eventoController.deleteEvento(req, res);
            } else {
                res.status(404).json({ error: "Rota não encontrada" });
            }
        }
    }
};

module.exports = eventoRoutes;


