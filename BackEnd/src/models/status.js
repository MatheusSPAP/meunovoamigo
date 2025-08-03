class Status {
    constructor(idstatus, tipo) {
        this.idstatus = idstatus;
        this.tipo = tipo;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.tipo || data.tipo.trim() === '') {
            errors.push('Tipo é obrigatório');
        }

        // Validação dos valores permitidos para tipo
        const tiposPermitidos = ['Disponível', 'Adotado'];
        if (data.tipo && !tiposPermitidos.includes(data.tipo)) {
            errors.push('Tipo deve ser "Disponível" ou "Adotado"');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new Status(
            row.idstatus,
            row.tipo
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            idstatus: this.idstatus,
            tipo: this.tipo
        };
    }
}

module.exports = Status;

