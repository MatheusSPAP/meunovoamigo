export interface Conversation {
    id: number;
    animal_id: number;
    interested_user_id: number;
    owner_user_id: number;
    created_at: string;

    // Joined properties from backend query
    animal_nome: string;
    animal_foto: string;
    owner_nome: string;
    interested_user_nome: string;
}
