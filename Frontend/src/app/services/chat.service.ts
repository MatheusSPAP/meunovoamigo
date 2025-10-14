import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/conversations';

  constructor(private http: HttpClient) { }

  startConversation(animalId: number, interestedUserId: number): Observable<Conversation> {
    return this.http.post<any>(this.apiUrl, { animal_id: animalId, interested_user_id: interestedUserId })
      .pipe(map(response => response.data));
  }

  getUserConversations(userId: number): Observable<Conversation[]> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`)
      .pipe(map(response => response.data));
  }

  getConversationById(conversationId: number): Observable<Conversation> {
    return this.http.get<any>(`${this.apiUrl}/${conversationId}`)
      .pipe(map(response => response.data));
  }

  getConversationMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<any>(`${this.apiUrl}/${conversationId}/messages`)
      .pipe(map(response => response.data));
  }

  postMessage(conversationId: number, messageData: { sender_id: number, receiver_id: number, message_text: string }): Observable<Message> {
    return this.http.post<any>(`${this.apiUrl}/${conversationId}/messages`, messageData)
      .pipe(map(response => response.data));
  }
}
