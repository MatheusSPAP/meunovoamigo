const Midia = require("../models/midia");

class MidiaController {
    async getAllMidias(req, res) {
        try {
            const midias = await Midia.getAll();
            res.json(midias);
        } catch (error) {
            console.error("Erro ao buscar mídias:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getMidiaById(req, res) {
        try {
            const { id } = req.params;
            const midia = await Midia.getById(id);
            
            if (!midia) {
                return res.status(404).json({ error: "Mídia não encontrada" });
            }
            
            res.json(midia);
        } catch (error) {
            console.error("Erro ao buscar mídia:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getMidiasByPublicacao(req, res) {
        try {
            const { publicacaoId } = req.params;
            const midias = await Midia.getByPublicacao(publicacaoId);
            res.json(midias);
        } catch (error) {
            console.error("Erro ao buscar mídias por publicação:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async createMidia(req, res) {
        try {
            const { nome, tamanho, postagem_idcomunidade, postagem_animal_idAnimal, postagem_usuario_idusuario } = req.body;
            
            if (!nome || tamanho === undefined || !postagem_idcomunidade || !postagem_animal_idAnimal || !postagem_usuario_idusuario) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" });
            }

            const midia = await Midia.create(nome, tamanho, postagem_idcomunidade, postagem_animal_idAnimal, postagem_usuario_idusuario);
            res.status(201).json(midia);
        } catch (error) {
            console.error("Erro ao criar mídia:", error);
            if (error.message === "Publicação não encontrada") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updateMidia(req, res) {
        try {
            const { id } = req.params;
            const { nome, tamanho } = req.body;
            
            const midia = await Midia.update(id, nome, tamanho);
            res.json(midia);
        } catch (error) {
            console.error("Erro ao atualizar mídia:", error);
            if (error.message === "Mídia não encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Nenhum campo para atualizar") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deleteMidia(req, res) {
        try {
            const { id } = req.params;
            
            const result = await Midia.delete(id);
            res.json(result);
        } catch (error) {
            console.error("Erro ao deletar mídia:", error);
            if (error.message === "Mídia não encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deleteMidiasByPublicacao(req, res) {
        try {
            const { publicacaoId } = req.params;
            
            const result = await Midia.deleteByPublicacao(publicacaoId);
            res.json(result);
        } catch (error) {
            console.error("Erro ao deletar mídias por publicação:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

module.exports = new MidiaController();

