class Message {
    constructor(model) {
        this.id = model.id;
        this.conversation_id = model.conversation_id;
        this.sender_id = model.sender_id;
        this.receiver_id = model.receiver_id;
        this.message_text = model.message_text;
        this.sent_at = model.sent_at;
        this.is_read = model.is_read;
    }

    static validate(model) {
        const errors = [];
        if (!model.conversation_id) errors.push('conversation_id is required');
        if (!model.sender_id) errors.push('sender_id is required');
        if (!model.receiver_id) errors.push('receiver_id is required');
        if (!model.message_text || model.message_text.trim() === '') {
            errors.push('message_text is required and cannot be empty');
        }
        return errors;
    }
}

module.exports = Message;