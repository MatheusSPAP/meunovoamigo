class Comportamento {
    constructor(idcomportamento, descricao) {
        this.idcomportamento = idcomportamento;
        this.descricao = descricao;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.descricao || data.descricao.trim() === '') {
            errors.push('Descrição é obrigatória');
        }

        // Validação dos valores permitidos para descrição
        const descricoesPermitidas = [
            'Brincalhão', 'Calmo', 'Tímido', 'Amigável com crianças', 
            'Agressivo com outros animais', 'Medroso', 'Sociável', 
            'Destruidor', 'Late/Mia muito', 'Gosta de água', 'Apegado', 
            'Independente', 'Comilão', 'Seletivo com comida', 'Gosta de colo', 
            'Anti-social', 'Curioso', 'Territorial'
        ];
        if (data.descricao && !descricoesPermitidas.includes(data.descricao)) {
            errors.push('Descrição deve ser um dos valores permitidos');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new Comportamento(
            row.idcomportamento,
            row.descricao
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            idcomportamento: this.idcomportamento,
            descricao: this.descricao
        };
    }
}

module.exports = Comportamento;
