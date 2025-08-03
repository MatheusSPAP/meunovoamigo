class Evento {
    constructor(idEvento, titulo, tipo_evento, endereco, descricao, data, fk_idusuario) {
        this.idEvento = idEvento;
        this.titulo = titulo;
        this.tipo_evento = tipo_evento;
        this.endereco = endereco;
        this.descricao = descricao;
        this.data = data;
        this.fk_idusuario = fk_idusuario;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.titulo || data.titulo.trim() === '') {
            errors.push('Título é obrigatório');
        }

        if (!data.tipo_evento || data.tipo_evento.trim() === '') {
            errors.push('Tipo do evento é obrigatório');
        }

        if (!data.endereco || data.endereco.trim() === '') {
            errors.push('Endereço é obrigatório');
        }

        if (!data.descricao || data.descricao.trim() === '') {
            errors.push('Descrição é obrigatória');
        }

        if (!data.data) {
            errors.push('Data é obrigatória');
        }

        if (!data.fk_idusuario) {
            errors.push('ID do usuário é obrigatório');
        }

        // Validação de tamanho dos campos
        if (data.titulo && data.titulo.length > 255) {
            errors.push('Título deve ter no máximo 255 caracteres');
        }

        if (data.tipo_evento && data.tipo_evento.length > 45) {
            errors.push('Tipo do evento deve ter no máximo 45 caracteres');
        }

        if (data.endereco && data.endereco.length > 45) {
            errors.push('Endereço deve ter no máximo 45 caracteres');
        }

        if (data.descricao && data.descricao.length > 255) {
            errors.push('Descrição deve ter no máximo 255 caracteres');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new Evento(
            row.idEvento,
            row.titulo,
            row.tipo_evento,
            row.endereco,
            row.descricao,
            row.data,
            row.fk_idusuario
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            idEvento: this.idEvento,
            titulo: this.titulo,
            tipo_evento: this.tipo_evento,
            endereco: this.endereco,
            descricao: this.descricao,
            data: this.data,
            fk_idusuario: this.fk_idusuario
        };
    }
}

module.exports = Evento;

