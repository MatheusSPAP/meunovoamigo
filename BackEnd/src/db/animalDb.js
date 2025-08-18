const db = require('./dbConfig');

class AnimalDb {

    static async insert(model) {
        const conn = await db.connect();

        const nome = model.nome;
        const sexo = model.sexo;
        const foto = model.foto;
        const descricao = model.descricao;
        const castrado = model.castrado;
        const vacinado = model.vacinado;
        const data_cadastro = model.data_cadastro;
        const fk_idusuario = model.fk_idusuario;
        const fk_idstatus = model.fk_idstatus;
        const tipo_idtipo_animal = model.tipo_idtipo_animal;
        const tamanho_animal_idtamanho_animal = model.tamanho_animal_idtamanho_animal;
        const comportamento_idcomportamento = model.comportamento_idcomportamento;
        const fk_idraca = model.fk_idraca;

        const query = `INSERT INTO animal (nome, sexo, foto, descricao, castrado, vacinado, data_cadastro, 
                       fk_idusuario, fk_idstatus, tipo_idtipo_animal, tamanho_animal_idtamanho_animal, 
                       comportamento_idcomportamento, fk_idraca) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        try {
            const [result] = await conn.execute(query, [nome, sexo, foto, descricao, castrado, vacinado, 
                data_cadastro, fk_idusuario, fk_idstatus, tipo_idtipo_animal, tamanho_animal_idtamanho_animal, 
                comportamento_idcomportamento, fk_idraca]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectAll() {
        const conn = await db.connect();

        const query = `SELECT a.*, u.nome as nome_usuario, s.tipo as status_tipo, 
                       t.tipo_animal, ta.descricao as tamanho_descricao, 
                       c.descricao as comportamento_descricao, r.tipo_raca as raca_nome
                       FROM animal a
                       LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
                       LEFT JOIN status s ON a.fk_idstatus = s.idstatus
                       LEFT JOIN tipo t ON a.tipo_idtipo_animal = t.idtipo_animal
                       LEFT JOIN tamanho_animal ta ON a.tamanho_animal_idtamanho_animal = ta.idtamanho_animal
                       LEFT JOIN comportamento c ON a.comportamento_idcomportamento = c.idcomportamento
                       LEFT JOIN raca r ON a.fk_idraca = r.idraca`;
        
        try {
            const [result] = await conn.execute(query);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectById(id) {
        const conn = await db.connect();

        const query = `SELECT a.*, u.nome as nome_usuario, s.tipo as status_tipo, 
                       t.tipo_animal, ta.descricao as tamanho_descricao, 
                       c.descricao as comportamento_descricao, r.tipo_raca as raca_nome
                       FROM animal a
                       LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
                       LEFT JOIN status s ON a.fk_idstatus = s.idstatus
                       LEFT JOIN tipo t ON a.tipo_idtipo_animal = t.idtipo_animal
                       LEFT JOIN tamanho_animal ta ON a.tamanho_animal_idtamanho_animal = ta.idtamanho_animal
                       LEFT JOIN comportamento c ON a.comportamento_idcomportamento = c.idcomportamento
                       LEFT JOIN raca r ON a.fk_idraca = r.idraca
                       WHERE a.idAnimal = ?`;
        
        try {
            const [result] = await conn.execute(query, [id]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByUsuario(idusuario) {
        const conn = await db.connect();

        const query = `SELECT a.*, u.nome as nome_usuario, s.tipo as status_tipo, 
                       t.tipo_animal, ta.descricao as tamanho_descricao, 
                       c.descricao as comportamento_descricao, r.tipo_raca as raca_nome
                       FROM animal a
                       LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
                       LEFT JOIN status s ON a.fk_idstatus = s.idstatus
                       LEFT JOIN tipo t ON a.tipo_idtipo_animal = t.idtipo_animal
                       LEFT JOIN tamanho_animal ta ON a.tamanho_animal_idtamanho_animal = ta.idtamanho_animal
                       LEFT JOIN comportamento c ON a.comportamento_idcomportamento = c.idcomportamento
                       LEFT JOIN raca r ON a.fk_idraca = r.idraca
                       WHERE a.fk_idusuario = ?`;
        
        try {
            const [result] = await conn.execute(query, [idusuario]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async selectByStatus(idstatus) {
        const conn = await db.connect();

        const query = `SELECT a.*, u.nome as nome_usuario, s.tipo as status_tipo, 
                       t.tipo_animal, ta.descricao as tamanho_descricao, 
                       c.descricao as comportamento_descricao, r.tipo_raca as raca_nome
                       FROM animal a
                       LEFT JOIN usuario u ON a.fk_idusuario = u.idusuario
                       LEFT JOIN status s ON a.fk_idstatus = s.idstatus
                       LEFT JOIN tipo t ON a.tipo_idtipo_animal = t.idtipo_animal
                       LEFT JOIN tamanho_animal ta ON a.tamanho_animal_idtamanho_animal = ta.idtamanho_animal
                       LEFT JOIN comportamento c ON a.comportamento_idcomportamento = c.idcomportamento
                       LEFT JOIN raca r ON a.fk_idraca = r.idraca
                       WHERE a.fk_idstatus = ?`;
        
        try {
            const [result] = await conn.execute(query, [idstatus]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async update(model) {
        const conn = await db.connect();

        const idAnimal = model.idAnimal;
        const nome = model.nome;
        const sexo = model.sexo;
        const foto = model.foto;
        const descricao = model.descricao;
        const castrado = model.castrado;
        const vacinado = model.vacinado;
        const fk_idstatus = model.fk_idstatus;
        const tipo_idtipo_animal = model.tipo_idtipo_animal;
        const tamanho_animal_idtamanho_animal = model.tamanho_animal_idtamanho_animal;
        const comportamento_idcomportamento = model.comportamento_idcomportamento;
        const fk_idraca = model.fk_idraca;

        const query = `UPDATE animal SET nome = ?, sexo = ?, foto = ?, descricao = ?, 
                       castrado = ?, vacinado = ?, fk_idstatus = ?, tipo_idtipo_animal = ?, 
                       tamanho_animal_idtamanho_animal = ?, comportamento_idcomportamento = ?, fk_idraca = ? 
                       WHERE idAnimal = ?`;

        try {
            const [result] = await conn.execute(query, [nome, sexo, foto, descricao, castrado, 
                vacinado, fk_idstatus, tipo_idtipo_animal, tamanho_animal_idtamanho_animal, 
                comportamento_idcomportamento, fk_idraca, idAnimal]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async delete(id) {
        const conn = await db.connect();

        const query = 'DELETE FROM animal WHERE idAnimal = ?';

        try {
            const [result] = await conn.execute(query, [id]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }
}

module.exports = AnimalDb;
