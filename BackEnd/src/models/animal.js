class Animal {
    constructor(idAnimal, nome, sexo, foto, descricao, castrado, vacinado, 
                data_cadastro, fk_idusuario, fk_idstatus, tipo_idtipo_animal, 
                tamanho_animal_idtamanho_animal, comportamento_idcomportamento, fk_idraca) {
        this.idAnimal = idAnimal;
        this.nome = nome;
        this.sexo = sexo;
        this.foto = foto;
        this.descricao = descricao;
        this.castrado = castrado;
        this.vacinado = vacinado;
        this.data_cadastro = data_cadastro;
        this.fk_idusuario = fk_idusuario;
        this.fk_idstatus = fk_idstatus;
        this.tipo_idtipo_animal = tipo_idtipo_animal;
        this.tamanho_animal_idtamanho_animal = tamanho_animal_idtamanho_animal;
        this.comportamento_idcomportamento = comportamento_idcomportamento;
        this.fk_idraca = fk_idraca;
    }

    // Método para validar dados obrigatórios
    static validate(data) {
        const errors = [];

        if (!data.nome || data.nome.trim() === '') {
            errors.push('Nome é obrigatório');
        }

        if (!data.sexo || data.sexo.trim() === '') {
            errors.push('Sexo é obrigatório');
        }

        if (!data.fk_idraca) {
            errors.push('ID da raça é obrigatório');
        }

        if (!data.foto || data.foto.trim() === '') {
            errors.push('Foto é obrigatória');
        }

        if (!data.descricao || data.descricao.trim() === '') {
            errors.push('Descrição é obrigatória');
        }

        if (!data.data_cadastro) {
            errors.push('Data de cadastro é obrigatória');
        }

        if (!data.fk_idusuario) {
            errors.push('ID do usuário é obrigatório');
        }

        if (!data.fk_idstatus) {
            errors.push('ID do status é obrigatório');
        }

        if (!data.tipo_idtipo_animal) {
            errors.push('ID do tipo de animal é obrigatório');
        }

        if (!data.tamanho_animal_idtamanho_animal) {
            errors.push('ID do tamanho do animal é obrigatório');
        }

        if (!data.comportamento_idcomportamento) {
            errors.push('ID do comportamento é obrigatório');
        }

        // Validação dos valores permitidos para sexo
        const sexosPermitidos = ['M', 'F'];
        if (data.sexo && !sexosPermitidos.includes(data.sexo)) {
            errors.push('Sexo deve ser "M" ou "F"');
        }

        // Validação de valores booleanos
        if (data.castrado !== undefined && typeof data.castrado !== 'boolean' && data.castrado !== 0 && data.castrado !== 1) {
            errors.push('Castrado deve ser verdadeiro ou falso');
        }

        if (data.vacinado !== undefined && typeof data.vacinado !== 'boolean' && data.vacinado !== 0 && data.vacinado !== 1) {
            errors.push('Vacinado deve ser verdadeiro ou falso');
        }

        return errors;
    }

    // Método para criar instância a partir de dados do banco
    static fromDatabase(row) {
        return new Animal(
            row.idAnimal,
            row.nome,
            row.sexo,
            row.foto,
            row.descricao,
            Boolean(row.castrado),
            Boolean(row.vacinado),
            row.data_cadastro,
            row.fk_idusuario,
            row.fk_idstatus,
            row.tipo_idtipo_animal,
            row.tamanho_animal_idtamanho_animal,
            row.comportamento_idcomportamento,
            row.fk_idraca
        );
    }

    // Método para converter para objeto simples
    toObject() {
        return {
            idAnimal: this.idAnimal,
            nome: this.nome,
            sexo: this.sexo,
            foto: this.foto,
            descricao: this.descricao,
            castrado: this.castrado,
            vacinado: this.vacinado,
            data_cadastro: this.data_cadastro,
            fk_idusuario: this.fk_idusuario,
            fk_idstatus: this.fk_idstatus,
            tipo_idtipo_animal: this.tipo_idtipo_animal,
            tamanho_animal_idtamanho_animal: this.tamanho_animal_idtamanho_animal,
            comportamento_idcomportamento: this.comportamento_idcomportamento,
            fk_idraca: this.fk_idraca
        };
    }
}

module.exports = Animal;