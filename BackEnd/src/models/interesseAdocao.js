class InteresseAdocao {
    constructor(idinteresse_adocao, mensagem, interesse_status, data_interesse, 
                usuario_idusuario, animal_idAnimal, animal_fk_idusuario, animal_fk_idstatus) {
        this.idinteresse_adocao = idinteresse_adocao;
        this.mensagem = mensagem;
        this.interesse_status = interesse_status;
        this.data_interesse = data_interesse;
        this.usuario_idusuario = usuario_idusuario;
        this.animal_idAnimal = animal_idAnimal;
        this.animal_fk_idusuario = animal_fk_idusuario;
        this.animal_fk_idstatus = animal_fk_idstatus;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.mensagem || data.mensagem.trim() === '') {
            errors.push('Mensagem é obrigatória');
        }

        if (!data.interesse_status || data.interesse_status.trim() === '') {
            errors.push('Status do interesse é obrigatório');
        }

        if (!data.data_interesse) {
            errors.push('Data do interesse é obrigatória');
        }

        if (!data.usuario_idusuario) {
            errors.push('ID do usuário é obrigatório');
        }

        if (!data.animal_idAnimal) {
            errors.push('ID do animal é obrigatório');
        }

        if (!data.animal_fk_idusuario) {
            errors.push('ID do usuário dono do animal é obrigatório');
        }

        if (!data.animal_fk_idstatus) {
            errors.push('ID do status do animal é obrigatório');
        }

        // Validação dos valores permitidos para interesse_status
        const statusPermitidos = ['Aguardando', 'Aprovado', 'Recusado'];
        if (data.interesse_status && !statusPermitidos.includes(data.interesse_status)) {
            errors.push('Status do interesse deve ser "Aguardando", "Aprovado" ou "Recusado"');
        }

        // Validação de tamanho da mensagem
        if (data.mensagem && data.mensagem.length > 255) {
            errors.push('Mensagem deve ter no máximo 255 caracteres');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new InteresseAdocao(
            row.idinteresse_adocao,
            row.mensagem,
            row.interesse_status,
            row.data_interesse,
            row.usuario_idusuario,
            row.animal_idAnimal,
            row.animal_fk_idusuario,
            row.animal_fk_idstatus
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            idinteresse_adocao: this.idinteresse_adocao,
            mensagem: this.mensagem,
            interesse_status: this.interesse_status,
            data_interesse: this.data_interesse,
            usuario_idusuario: this.usuario_idusuario,
            animal_idAnimal: this.animal_idAnimal,
            animal_fk_idusuario: this.animal_fk_idusuario,
            animal_fk_idstatus: this.animal_fk_idstatus
        };
    }
}

module.exports = InteresseAdocao;

