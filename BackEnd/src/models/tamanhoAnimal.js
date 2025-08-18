class TamanhoAnimal {
    constructor(idtamanho_animal, descricao) {
        this.idtamanho_animal = idtamanho_animal;
        this.descricao = descricao;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.descricao || data.descricao.trim() === '') {
            errors.push('Descrição é obrigatória');
        }

        // Validação dos valores permitidos para descrição
        const tamanhosPermitidos = ['Pequeno', 'Médio', 'Grande'];
        if (data.descricao && !tamanhosPermitidos.includes(data.descricao)) {
            errors.push('Descrição deve ser "Pequeno", "Médio" ou "Grande"');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new TamanhoAnimal(
            row.idtamanho_animal,
            row.descricao
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            idtamanho_animal: this.idtamanho_animal,
            descricao: this.descricao
        };
    }
}

module.exports = TamanhoAnimal;

