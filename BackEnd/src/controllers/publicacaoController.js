const Publicacao = require("../models/publicacao");

class PublicacaoController {
    async getAllPublicacoes(req, res) {
        try {
            const publicacoes = await Publicacao.getAll();
            res.json(publicacoes);
        } catch (error) {
            console.error("Erro ao buscar publicações:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getPublicacaoById(req, res) {
        try {
            const { id } = req.params;
            const publicacao = await Publicacao.getById(id);
            
            if (!publicacao) {
                return res.status(404).json({ error: "Publicação não encontrada" });
            }
            
            res.json(publicacao);
        } catch (error) {
            console.error("Erro ao buscar publicação:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async createPublicacao(req, res) {
        try {
            const { titulo, descricao, animal_idAnimal, usuario_idusuario } = req.body;
            
            if (!titulo || !descricao || !animal_idAnimal || !usuario_idusuario) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" });
            }

            const publicacao = await Publicacao.create(titulo, descricao, animal_idAnimal, usuario_idusuario);
            res.status(201).json(publicacao);
        } catch (error) {
            console.error("Erro ao criar publicação:", error);
            if (error.message === "Usuário não encontrado" || error.message === "Animal não encontrado") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updatePublicacao(req, res) {
        try {
            const { id } = req.params;
            const { titulo, descricao } = req.body;
            
            const publicacao = await Publicacao.update(id, titulo, descricao);
            res.json(publicacao);
        } catch (error) {
            console.error("Erro ao atualizar publicação:", error);
            if (error.message === "Publicação não encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Nenhum campo para atualizar") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deletePublicacao(req, res) {
        try {
            const { id } = req.params;
            
            const result = await Publicacao.delete(id);
            res.json(result);
        } catch (error) {
            console.error("Erro ao deletar publicação:", error);
            if (error.message === "Publicação não encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getPublicacoesByUsuario(req, res) {
        try {
            const { usuarioId } = req.params;
            const publicacoes = await Publicacao.getByUsuario(usuarioId);
            res.json(publicacoes);
        } catch (error) {
            console.error("Erro ao buscar publicações por usuário:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getPublicacoesByAnimal(req, res) {
        try {
            const { animalId } = req.params;
            const publicacoes = await Publicacao.getByAnimal(animalId);
            res.json(publicacoes);
        } catch (error) {
            console.error("Erro ao buscar publicações por animal:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

module.exports = new PublicacaoController();

