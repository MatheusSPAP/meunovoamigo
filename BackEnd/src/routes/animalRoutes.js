const animalController = require('../controllers/animalController');

const animalRoutes = {
    async handleRequest(req, res) {
        const path = req.url;
        const method = req.method;
        
        if (path.startsWith('/api/animais')) {
            if (method === 'GET' && !req.params.id) {
                await animalController.getAllAnimais(req, res);
            } else if (method === 'GET' && req.params.id) {
                await animalController.getAnimalById(req, res);
            } else if (method === 'POST') {
                await animalController.createAnimal(req, res);
            } else if (method === 'PUT' && req.params.id) {
                await animalController.updateAnimal(req, res);
            } else if (method === 'DELETE' && req.params.id) {
                await animalController.deleteAnimal(req, res);
            } else {
                res.status(404).json({ error: 'Rota não encontrada' });
            }
        }
    }
};

module.exports = animalRoutes;

