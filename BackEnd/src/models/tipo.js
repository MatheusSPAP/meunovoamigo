class Tipo {
    constructor(idtipo_animal, tipo_animal) {
        this.idtipo_animal = idtipo_animal;
        this.tipo_animal = tipo_animal;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.tipo_animal || data.tipo_animal.trim() === '') {
            errors.push('Tipo de animal é obrigatório');
        }

        // Validação dos valores permitidos para tipo_animal
        const tiposPermitidos = ['Cachorro', 'Gato'];
        if (data.tipo_animal && !tiposPermitidos.includes(data.tipo_animal)) {
            errors.push('Tipo de animal deve ser "Cachorro" ou "Gato"');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new Tipo(
            row.idtipo_animal,
            row.tipo_animal
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            idtipo_animal: this.idtipo_animal,
            tipo_animal: this.tipo_animal
        };
    }
}

module.exports = Tipo;

