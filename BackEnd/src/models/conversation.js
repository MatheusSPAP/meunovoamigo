class Conversation {
    constructor(model) {
        this.id = model.id;
        this.animal_id = model.animal_id;
        this.interested_user_id = model.interested_user_id;
        this.owner_user_id = model.owner_user_id;
        this.created_at = model.created_at;
    }

    static validate(model) {
        const errors = [];
        if (!model.animal_id) errors.push('animal_id is required');
        if (!model.interested_user_id) errors.push('interested_user_id is required');
        if (!model.owner_user_id) errors.push('owner_user_id is required');
        return errors;
    }
}

module.exports = Conversation;