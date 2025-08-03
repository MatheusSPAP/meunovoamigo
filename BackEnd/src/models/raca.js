class Raca {
    constructor(idraca, tipo_idtipo_animal, tipo_raca) {
        this.idraca = idraca;
        this.tipo_idtipo_animal = tipo_idtipo_animal;
        this.tipo_raca = tipo_raca;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.idraca) {
            errors.push('ID da raça é obrigatório');
        }

        if (!data.tipo_idtipo_animal) {
            errors.push('ID do tipo de animal é obrigatório');
        }

        if (!data.tipo_raca || data.tipo_raca.trim() === '') {
            errors.push('Tipo da raça é obrigatório');
        }

        // Validação dos valores permitidos para tipo_raca
        const racasPermitidas = [
            'Vira-lata (cão)', 'Labrador', 'Poodle', 'Bulldog', 'Pinscher',
            'Vira-lata (gato)', 'Siamês', 'Persa', 'Outra'
        ];
        if (data.tipo_raca && !racasPermitidas.includes(data.tipo_raca)) {
            errors.push('Tipo da raça deve ser um dos valores permitidos');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new Raca(
            row.idraca,
            row.tipo_idtipo_animal,
            row.tipo_raca
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            idraca: this.idraca,
            tipo_idtipo_animal: this.tipo_idtipo_animal,
            tipo_raca: this.tipo_raca
        };
    }
}

module.exports = Raca;

