const comentarioController = require('../controllers/comentarioController');

const comentarioRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith('/api/comentarios')) {
            if (method === 'GET') {
                await comentarioController.getComentariosByPostagem(req, res);
            } else if (method === 'POST') {
                await comentarioController.createComentario(req, res);
            } else if (method === 'DELETE' && req.params.id) {
                await comentarioController.deleteComentario(req, res);
            } else if (method === 'PUT' && req.params.id) {
                await comentarioController.updateComentario(req, res);
            } else {
                res.status(404).json({ error: 'Rota não encontrada' });
            }
        }
    }
};

module.exports = comentarioRoutes;

