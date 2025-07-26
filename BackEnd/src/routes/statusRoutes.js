const statusController = require('../controllers/statusController');

const statusRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith('/api/status')) {
            if (method === 'GET' && !req.params.id) {
                await statusController.getAllStatus(req, res);
            } else if (method === 'GET' && req.params.id) {
                await statusController.getStatusById(req, res);
            } else if (method === 'POST') {
                await statusController.createStatus(req, res);
            } else if (method === 'PUT' && req.params.id) {
                await statusController.updateStatus(req, res);
            } else if (method === 'DELETE' && req.params.id) {
                await statusController.deleteStatus(req, res);
            } else {
                res.status(404).json({ error: 'Rota não encontrada' });
            }
        }
    }
};

module.exports = statusRoutes;

