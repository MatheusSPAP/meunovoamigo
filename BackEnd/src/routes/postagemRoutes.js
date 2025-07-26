const postagemController = require('../controllers/postagemController');

const postagemRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith('/api/postagens')) {
            if (method === 'GET' && !req.params.id) {
                await postagemController.getAllPostagens(req, res);
            } else if (method === 'GET' && req.params.id) {
                await postagemController.getPostagemById(req, res);
            } else if (method === 'POST') {
                await postagemController.createPostagem(req, res);
            } else if (method === 'PUT' && req.params.id) {
                await postagemController.updatePostagem(req, res);
            } else if (method === 'DELETE' && req.params.id) {
                await postagemController.deletePostagem(req, res);
            } else {
                res.status(404).json({ error: 'Rota não encontrada' });
            }
        }
    }
};

module.exports = postagemRoutes;

