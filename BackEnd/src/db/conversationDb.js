const db = require('./dbConfig');

class ConversationDb {

    static async create(conversationModel) {
        const conn = await db.connect();
        const query = 'INSERT INTO conversations (animal_id, interested_user_id, owner_user_id) VALUES (?, ?, ?)';
        try {
            const [result] = await conn.execute(query, [
                conversationModel.animal_id,
                conversationModel.interested_user_id,
                conversationModel.owner_user_id
            ]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async findByUser(userId) {
        const conn = await db.connect();
        const query = `
            SELECT 
                c.*, 
                a.nome as animal_nome, 
                a.foto as animal_foto,
                owner.nome as owner_nome,
                interested.nome as interested_user_nome
            FROM conversations c
            JOIN animal a ON c.animal_id = a.idAnimal
            JOIN usuario owner ON c.owner_user_id = owner.idusuario
            JOIN usuario interested ON c.interested_user_id = interested.idusuario
            WHERE c.interested_user_id = ? OR c.owner_user_id = ?
            ORDER BY c.created_at DESC
        `;
        try {
            const [result] = await conn.execute(query, [userId, userId]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async findById(conversationId) {
        const conn = await db.connect();
        const query = `
            SELECT 
                c.*, 
                a.nome as animal_nome, 
                a.foto as animal_foto,
                owner.nome as owner_nome,
                interested.nome as interested_user_nome
            FROM conversations c
            JOIN animal a ON c.animal_id = a.idAnimal
            JOIN usuario owner ON c.owner_user_id = owner.idusuario
            JOIN usuario interested ON c.interested_user_id = interested.idusuario
            WHERE c.id = ?
        `;
        try {
            const [result] = await conn.execute(query, [conversationId]);
            conn.release();
            return result[0];
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async findByAnimalAndUser(animalId, interestedUserId) {
        const conn = await db.connect();
        const query = 'SELECT * FROM conversations WHERE animal_id = ? AND interested_user_id = ?';
        try {
            const [result] = await conn.execute(query, [animalId, interestedUserId]);
            conn.release();
            return result[0]; // Returns the conversation or undefined
        } catch (error) {
            conn.release();
            throw error;
        }
    }
}

module.exports = ConversationDb;