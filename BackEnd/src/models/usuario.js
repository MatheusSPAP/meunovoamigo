class Usuario {
    constructor(idusuario, nome, telefone, email, senha, cidade, endereco) {
        this.idusuario = idusuario;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.cidade = cidade;
        this.endereco = endereco;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.nome || data.nome.trim() === '') {
            errors.push({ field: 'nome', message: 'Nome é obrigatório' });
        }

        if (!data.telefone || data.telefone.trim() === '') {
            errors.push({ field: 'telefone', message: 'Telefone é obrigatório' });
        }

        if (!data.email || data.email.trim() === '') {
            errors.push({ field: 'email', message: 'Email é obrigatório' });
        }

        if (data.senha !== undefined && (!data.senha || data.senha.trim() === '')) {
            errors.push({ field: 'senha', message: 'Senha é obrigatória' });
        }

        if (!data.cidade || data.cidade.trim() === '') {
            errors.push({ field: 'cidade', message: 'Cidade é obrigatória' });
        }

        if (!data.endereco || data.endereco.trim() === '') {
            errors.push({ field: 'endereco', message: 'Endereço é obrigatório' });
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            errors.push({ field: 'email', message: 'Email deve ter um formato válido' });
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new Usuario(
            row.idusuario,
            row.nome,
            row.telefone,
            row.email,
            row.senha,
            row.cidade,
            row.endereco
        );
    }

    // Método para converter para objeto simples (sem senha)
    toPublic() {
        return {
            idusuario: this.idusuario,
            nome: this.nome,
            telefone: this.telefone,
            email: this.email,
            cidade: this.cidade,
            endereco: this.endereco
        };
    }
}

module.exports = Usuario;

