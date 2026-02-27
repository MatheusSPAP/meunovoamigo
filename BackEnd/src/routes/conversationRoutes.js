const express = require('express');
const router = express.Router();
const ConversationController = require('../controllers/conversationController');

// Route to start a new conversation or get an existing one
router.post('/', ConversationController.startConversation);

// Route to get all conversations for a user
router.get('/user/:userId', ConversationController.getUserConversations);

// Route to get a specific conversation by ID
router.get('/:id', ConversationController.getConversationById);

// Route to get messages for a specific conversation
router.get('/:id/messages', ConversationController.getConversationMessages);

// Route to post a new message in a conversation
router.post('/:id/messages', ConversationController.postMessage);

module.exports = router;