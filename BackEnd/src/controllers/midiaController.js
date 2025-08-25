const MidiaDb = require('../db/midiaDb');
const Midia = require('../models/midia');
const fs = require('fs');
const path = require('path');

class MidiaController {

    static async create(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhum arquivo enviado. O campo deve se chamar \'arquivo\'.'
                });
            }

            // Extrai os IDs do corpo da requisição
            const { postagem_idcomunidade, postagem_animal_idAnimal, postagem_usuario_idusuario } = req.body;

            // Monta o objeto de mídia com dados do arquivo e do corpo da requisição
            const midiaData = {
                nome_arquivo: req.file.originalname,
                tipo: req.file.mimetype.startsWith('image') ? 'foto' : 'video',
                tamanho: req.file.size,
                caminho: req.file.path,
                data_upload: new Date(),
                postagem_idcomunidade: postagem_idcomunidade || null,
                postagem_animal_idAnimal: postagem_animal_idAnimal || null,
                postagem_usuario_idusuario: postagem_usuario_idusuario || null
            };

            const errors = Midia.validate(midiaData);
            if (errors.length > 0) {
                // Se a validação falhar, deleta o arquivo que foi upado
                fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors
                });
            }

            const result = await MidiaDb.insert(midiaData);
            
            res.status(201).json({
                success: true,
                message: 'Mídia criada com sucesso',
                data: { id: result.insertId, path: req.file.path }
            });

        } catch (error) {
            console.error('Erro ao criar mídia:', error);
            // Se ocorrer um erro, tenta deletar o arquivo que pode ter sido upado
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    static async getAll(req, res) {
        try {
            const midias = await MidiaDb.selectAll();
            res.status(200).json({ success: true, data: midias });
        } catch (error) {
            console.error('Erro ao buscar mídias:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const midia = await MidiaDb.selectById(id);

            if (!midia) {
                return res.status(404).json({ success: false, message: 'Mídia não encontrada' });
            }
            res.status(200).json({ success: true, data: midia });
        } catch (error) {
            console.error('Erro ao buscar mídia:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        }
    }

    static async getByPostagem(req, res) {
        try {
            const { idcomunidade } = req.params;
            const midias = await MidiaDb.selectByPostagem(idcomunidade);
            res.status(200).json({ success: true, data: midias });
        } catch (error) {
            console.error('Erro ao buscar mídias por postagem:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const midia = await MidiaDb.selectById(id);

            if (!midia) {
                return res.status(404).json({ success: false, message: 'Mídia não encontrada' });
            }

            // Deleta o arquivo físico
            const filePath = path.resolve(midia.caminho);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Deleta o registro do banco
            await MidiaDb.delete(id);

            res.status(200).json({ success: true, message: 'Mídia deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar mídia:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        }
    }
}

module.exports = MidiaController;
