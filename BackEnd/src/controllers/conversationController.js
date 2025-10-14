const ConversationDb = require('../db/conversationDb');
const MessageDb = require('../db/messageDb');
const AnimalDb = require('../db/animalDb');
const Conversation = require('../models/conversation');
const Message = require('../models/message');

class ConversationController {

    // GET /api/conversations/user/:userId
    static async getUserConversations(req, res) {
        try {
            const { userId } = req.params; 
            const conversations = await ConversationDb.findByUser(parseInt(userId));
            res.status(200).json({ success: true, data: conversations });
        } catch (error) {
            console.error('Error fetching user conversations:', error);
            res.status(500).json({ success: false, message: 'Error fetching conversations' });
        }
    }

    // GET /api/conversations/:id
    static async getConversationById(req, res) {
        try {
            const { id } = req.params;
            const conversation = await ConversationDb.findById(parseInt(id));
            if (!conversation) {
                return res.status(404).json({ success: false, message: 'Conversation not found' });
            }
            res.status(200).json({ success: true, data: conversation });
        } catch (error) {
            console.error('Error fetching conversation:', error);
            res.status(500).json({ success: false, message: 'Error fetching conversation' });
        }
    }

    // GET /api/conversations/:id/messages
    static async getConversationMessages(req, res) {
        try {
            const { id } = req.params;
            const messages = await MessageDb.findByConversation(parseInt(id));
            res.status(200).json({ success: true, data: messages });
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ success: false, message: 'Error fetching messages' });
        }
    }

    // POST /api/conversations/:id/messages
    static async postMessage(req, res) {
        try {
            const { id } = req.params;
            const { sender_id, receiver_id, message_text } = req.body;
            const messageModel = { conversation_id: parseInt(id), sender_id, receiver_id, message_text };

            const errors = Message.validate(messageModel);
            if (errors.length > 0) {
                return res.status(400).json({ success: false, message: 'Invalid message data', errors });
            }

            const result = await MessageDb.create(messageModel);
            res.status(201).json({ success: true, message: 'Message sent', data: { id: result.insertId } });
        } catch (error) {
            console.error('Error posting message:', error);
            res.status(500).json({ success: false, message: 'Error posting message' });
        }
    }

    // POST /api/conversations
    static async startConversation(req, res) {
        try {
            const { animal_id, interested_user_id } = req.body;

            // 1. Get animal owner
            const animal = await AnimalDb.selectById(animal_id);
            if (!animal) {
                return res.status(404).json({ success: false, message: 'Animal not found' });
            }
            const owner_user_id = animal.fk_idusuario;

            // 2. Check if conversation already exists
            let conversation = await ConversationDb.findByAnimalAndUser(animal_id, interested_user_id);

            if (conversation) {
                // Conversation already exists, return its ID
                return res.status(200).json({ success: true, message: 'Conversation already exists', data: conversation });
            }

            // 3. If not, create it
            const conversationModel = { animal_id, interested_user_id, owner_user_id };
            const validationErrors = Conversation.validate(conversationModel);
            if (validationErrors.length > 0) {
                return res.status(400).json({ success: false, message: 'Invalid conversation data', errors: validationErrors });
            }

            const result = await ConversationDb.create(conversationModel);
            const newConversationId = result.insertId;
            
            const newConversation = { id: newConversationId, ...conversationModel };

            res.status(201).json({ success: true, message: 'Conversation started', data: newConversation });

        } catch (error) {
            console.error('Error starting conversation:', error);
            res.status(500).json({ success: false, message: 'Error starting conversation' });
        }
    }
}

module.exports = ConversationController;