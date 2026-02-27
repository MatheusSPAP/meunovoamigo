const db = require('./dbConfig');

class MessageDb {

    static async create(messageModel) {
        const conn = await db.connect();
        const query = 'INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text) VALUES (?, ?, ?, ?)';
        try {
            const [result] = await conn.execute(query, [
                messageModel.conversation_id,
                messageModel.sender_id,
                messageModel.receiver_id,
                messageModel.message_text
            ]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }

    static async findByConversation(conversationId) {
        const conn = await db.connect();
        const query = `
            SELECT * 
            FROM messages 
            WHERE conversation_id = ? 
            ORDER BY sent_at ASC
        `;
        try {
            const [result] = await conn.execute(query, [conversationId]);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            throw error;
        }
    }
}

module.exports = MessageDb;