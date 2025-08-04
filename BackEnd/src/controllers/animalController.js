const Animal = require("../models/animal");

class AnimalController {
    async getAllAnimais(req, res) {
        try {
            const animais = await Animal.getAll();
            res.json(animais);
        } catch (error) {
            console.error("Erro ao buscar animais:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getAnimalById(req, res) {
        try {
            const { id } = req.params;
            const animal = await Animal.getById(id);
            
            if (!animal) {
                return res.status(404).json({ error: "Animal não encontrado" });
            }
            
            res.json(animal);
        } catch (error) {
            console.error("Erro ao buscar animal:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async createAnimal(req, res) {
        try {
            const { nome, raca, foto, descricao, latitude, longitude, fk_idraca, fk_idusuario, fk_idstatus } = req.body;
            
            if (!nome || !raca || !foto || !descricao || latitude === undefined || longitude === undefined || !fk_idraca || !fk_idusuario || !fk_idstatus) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" });
            }

            const animal = await Animal.create(nome, raca, foto, descricao, latitude, longitude, fk_idraca, fk_idusuario, fk_idstatus);
            res.status(201).json(animal);
        } catch (error) {
            console.error("Erro ao criar animal:", error);
            if (error.message === "Usuário não encontrado" || error.message === "Status não encontrado" || error.message === "Raça não encontrada") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updateAnimal(req, res) {
        try {
            const { id } = req.params;
            const { nome, raca, foto, descricao, latitude, longitude, fk_idraca, fk_idusuario, fk_idstatus } = req.body;
            
            const animal = await Animal.update(id, nome, raca, foto, descricao, latitude, longitude, fk_idraca, fk_idusuario, fk_idstatus);
            res.json(animal);
        } catch (error) {
            console.error("Erro ao atualizar animal:", error);
            if (error.message === "Animal não encontrado") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Usuário não encontrado" || error.message === "Status não encontrado" || error.message === "Raça não encontrada" || error.message === "Nenhum campo para atualizar") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deleteAnimal(req, res) {
        try {
            const { id } = req.params;
            
            const result = await Animal.delete(id);
            res.json(result);
        } catch (error) {
            console.error("Erro ao deletar animal:", error);
            if (error.message === "Animal não encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getAnimaisByStatus(req, res) {
        try {
            const { status } = req.params;
            const animais = await Animal.getByStatus(status);
            res.json(animais);
        } catch (error) {
            console.error("Erro ao buscar animais por status:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getAnimaisByTipo(req, res) {
        try {
            const { tipo } = req.params;
            const animais = await Animal.getByTipo(tipo);
            res.json(animais);
        } catch (error) {
            console.error("Erro ao buscar animais por tipo:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getAnimaisByLocation(req, res) {
        try {
            const { latitude, longitude, radius } = req.query;
            
            if (!latitude || !longitude) {
                return res.status(400).json({ error: "Latitude e longitude são obrigatórias" });
            }

            const animais = await Animal.getByLocation(parseFloat(latitude), parseFloat(longitude), radius ? parseFloat(radius) : 10);
            res.json(animais);
        } catch (error) {
            console.error("Erro ao buscar animais por localização:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

module.exports = new AnimalController();

