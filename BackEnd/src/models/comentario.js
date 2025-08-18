class Comentario {
    constructor(fk_idcomunidade, fk_idusuario, mensagem, data_comentario, id_comentario = null) {
        this.fk_idcomunidade = fk_idcomunidade;
        this.fk_idusuario = fk_idusuario;
        this.mensagem = mensagem;
        this.data_comentario = data_comentario;
        this.id_comentario = id_comentario; // ID pode ser nulo ao criar
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.fk_idcomunidade) {
            errors.push('ID da comunidade é obrigatório');
        }

        if (!data.fk_idusuario) {
            errors.push('ID do usuário é obrigatório');
        }

        if (!data.mensagem || data.mensagem.trim() === '') {
            errors.push('Mensagem é obrigatória');
        }

        if (!data.data_comentario) {
            errors.push('Data do comentário é obrigatória');
        }

        // Validação de tamanho da mensagem
        if (data.mensagem && data.mensagem.length > 255) {
            errors.push('Mensagem deve ter no máximo 255 caracteres');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new Comentario(
            row.fk_idcomunidade,
            row.fk_idusuario,
            row.mensagem,
            row.data_comentario,
            row.id_comentario
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            fk_idcomunidade: this.fk_idcomunidade,
            fk_idusuario: this.fk_idusuario,
            mensagem: this.mensagem,
            data_comentario: this.data_comentario,
            id_comentario: this.id_comentario
        };
    }
}

module.exports = Comentario;

