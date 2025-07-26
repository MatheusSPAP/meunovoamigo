const usuarioController = require('../controllers/usuarioController');

const usuarioRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith('/api/usuarios')) {
            if (method === 'GET' && !req.params.id) {
                await usuarioController.getAllUsuarios(req, res);
            } else if (method === 'GET' && req.params.id) {
                await usuarioController.getUsuarioById(req, res);
            } else if (method === 'POST') {
                await usuarioController.createUsuario(req, res);
            } else if (method === 'PUT' && req.params.id) {
                await usuarioController.updateUsuario(req, res);
            } else if (method === 'DELETE' && req.params.id) {
                await usuarioController.deleteUsuario(req, res);
            } else {
                res.status(404).json({ error: 'Rota não encontrada' });
            }
        }
    }
};

module.exports = usuarioRoutes;

