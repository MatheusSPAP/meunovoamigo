class Postagem {
    constructor(idcomunidade, descricao, data_postagem, titulo, animal_idAnimal, usuario_idusuario) {
        this.idcomunidade = idcomunidade;
        this.descricao = descricao;
        this.data_postagem = data_postagem;
        this.titulo = titulo;
        this.animal_idAnimal = animal_idAnimal;
        this.usuario_idusuario = usuario_idusuario;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.descricao || data.descricao.trim() === '') {
            errors.push('Descrição é obrigatória');
        }

        if (!data.titulo || data.titulo.trim() === '') {
            errors.push('Título é obrigatório');
        }

        if (!data.data_postagem) {
            errors.push('Data da postagem é obrigatória');
        }

        if (!data.animal_idAnimal) {
            errors.push('ID do animal é obrigatório');
        }

        if (!data.usuario_idusuario) {
            errors.push('ID do usuário é obrigatório');
        }

        // Validação de tamanho dos campos
        if (data.descricao && data.descricao.length > 255) {
            errors.push('Descrição deve ter no máximo 255 caracteres');
        }

        if (data.titulo && data.titulo.length > 45) {
            errors.push('Título deve ter no máximo 45 caracteres');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new Postagem(
            row.idcomunidade,
            row.descricao,
            row.data_postagem,
            row.titulo,
            row.animal_idAnimal,
            row.usuario_idusuario
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            idcomunidade: this.idcomunidade,
            descricao: this.descricao,
            data_postagem: this.data_postagem,
            titulo: this.titulo,
            animal_idAnimal: this.animal_idAnimal,
            usuario_idusuario: this.usuario_idusuario
        };
    }
}

module.exports = Postagem;

