const TipoAnimal = require("../models/tipoAnimal");

class TipoAnimalController {
    async getAllTipos(req, res) {
        try {
            const tipos = await TipoAnimal.getAll();
            res.json(tipos);
        } catch (error) {
            console.error("Erro ao buscar tipos de animal:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getTipoById(req, res) {
        try {
            const { id } = req.params;
            const tipo = await TipoAnimal.getById(id);
            
            if (!tipo) {
                return res.status(404).json({ error: "Tipo de animal não encontrado" });
            }
            
            res.json(tipo);
        } catch (error) {
            console.error("Erro ao buscar tipo de animal:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async createTipo(req, res) {
        try {
            const { nome } = req.body;
            
            if (!nome) {
                return res.status(400).json({ error: "Nome é obrigatório" });
            }

            const tipo = await TipoAnimal.create(nome);
            res.status(201).json(tipo);
        } catch (error) {
            console.error("Erro ao criar tipo de animal:", error);
            if (error.message === "Tipo de animal já existe") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updateTipo(req, res) {
        try {
            const { id } = req.params;
            const { nome } = req.body;
            
            if (!nome) {
                return res.status(400).json({ error: "Nome é obrigatório" });
            }

            const tipo = await TipoAnimal.update(id, nome);
            res.json(tipo);
        } catch (error) {
            console.error("Erro ao atualizar tipo de animal:", error);
            if (error.message === "Tipo de animal não encontrado") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Tipo de animal já existe") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deleteTipo(req, res) {
        try {
            const { id } = req.params;
            
            const result = await TipoAnimal.delete(id);
            res.json(result);
        } catch (error) {
            console.error("Erro ao deletar tipo de animal:", error);
            if (error.message === "Tipo de animal não encontrado") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Não é possível deletar tipo de animal que está sendo usado por raças") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

module.exports = new TipoAnimalController();

