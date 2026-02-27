export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    receiver_id: number;
    message_text: string;
    sent_at: string;
    is_read: number; // 0 for false, 1 for true
}
