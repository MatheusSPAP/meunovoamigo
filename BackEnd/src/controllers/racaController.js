const Raca = require("../models/raca");

class RacaController {
    async getAllRacas(req, res) {
        try {
            const racas = await Raca.getAll();
            res.json(racas);
        } catch (error) {
            console.error("Erro ao buscar raças:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getRacaById(req, res) {
        try {
            const { id } = req.params;
            const raca = await Raca.getById(id);
            
            if (!raca) {
                return res.status(404).json({ error: "Raça não encontrada" });
            }
            
            res.json(raca);
        } catch (error) {
            console.error("Erro ao buscar raça:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getRacasByTipo(req, res) {
        try {
            const { tipoId } = req.params;
            const racas = await Raca.getByTipo(tipoId);
            res.json(racas);
        } catch (error) {
            console.error("Erro ao buscar raças por tipo:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async createRaca(req, res) {
        try {
            const { nome, fk_idtipo } = req.body;
            
            if (!nome || !fk_idtipo) {
                return res.status(400).json({ error: "Nome e tipo são obrigatórios" });
            }

            const raca = await Raca.create(nome, fk_idtipo);
            res.status(201).json(raca);
        } catch (error) {
            console.error("Erro ao criar raça:", error);
            if (error.message === "Tipo de animal não encontrado") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updateRaca(req, res) {
        try {
            const { id } = req.params;
            const { nome, fk_idtipo } = req.body;
            
            const raca = await Raca.update(id, nome, fk_idtipo);
            res.json(raca);
        } catch (error) {
            console.error("Erro ao atualizar raça:", error);
            if (error.message === "Raça não encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Tipo de animal não encontrado" || error.message === "Nenhum campo para atualizar") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deleteRaca(req, res) {
        try {
            const { id } = req.params;
            
            const result = await Raca.delete(id);
            res.json(result);
        } catch (error) {
            console.error("Erro ao deletar raça:", error);
            if (error.message === "Raça não encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Não é possível deletar raça que está sendo usada por animais") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

module.exports = new RacaController();

