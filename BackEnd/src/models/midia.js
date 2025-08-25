class Midia {
    constructor(idmidia, nome_arquivo, tipo, tamanho, caminho, data_upload, postagem_idcomunidade) {
        this.idmidia = idmidia;
        this.nome_arquivo = nome_arquivo;
        this.tipo = tipo;
        this.tamanho = tamanho;
        this.caminho = caminho;
        this.data_upload = data_upload;
        this.postagem_idcomunidade = postagem_idcomunidade;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.nome_arquivo || data.nome_arquivo.trim() === '') {
            errors.push('Nome do arquivo é obrigatório');
        }
        if (!data.tipo || data.tipo.trim() === '') {
            errors.push('Tipo é obrigatório');
        }
        if (!data.tamanho || data.tamanho <= 0) {
            errors.push('Tamanho deve ser maior que zero');
        }
        if (!data.caminho || data.caminho.trim() === '') {
            errors.push('Caminho é obrigatório');
        }
        if (!data.data_upload) {
            errors.push('Data de upload é obrigatória');
        }
        if (!data.postagem_idcomunidade) {
            errors.push('ID da postagem é obrigatório');
        }

        // Validação dos valores permitidos para tipo
        const tiposPermitidos = ['foto', 'video'];
        if (data.tipo && !tiposPermitidos.includes(data.tipo)) {
            errors.push('Tipo deve ser "foto" ou "video"');
        }

        // Validação de tamanho dos campos
        if (data.nome_arquivo && data.nome_arquivo.length > 255) {
            errors.push('Nome do arquivo deve ter no máximo 255 caracteres');
        }
        if (data.caminho && data.caminho.length > 512) {
            errors.push('Caminho deve ter no máximo 512 caracteres');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new Midia(
            row.idmidia,
            row.nome_arquivo,
            row.tipo,
            row.tamanho,
            row.caminho,
            row.data_upload,
            row.postagem_idcomunidade
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            idmidia: this.idmidia,
            nome_arquivo: this.nome_arquivo,
            tipo: this.tipo,
            tamanho: this.tamanho,
            caminho: this.caminho,
            data_upload: this.data_upload,
            postagem_idcomunidade: this.postagem_idcomunidade
        };
    }
}

module.exports = Midia;