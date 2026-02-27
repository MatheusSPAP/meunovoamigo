import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { UsuarioService } from '../../usuario.service';
import { Conversation } from '../../models/conversation.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chat-list.html',
  styleUrls: ['./chat-list.css']
})
export class ChatListComponent implements OnInit {
  conversations$: Observable<Conversation[]> = of([]);
  currentUserId: number | null = null;
  apiBaseUrl = 'http://localhost:3000';

  constructor(
    private chatService: ChatService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.conversations$ = this.usuarioService.currentUserId$.pipe(
      switchMap(userId => {
        if (userId) {
          this.currentUserId = userId;
          return this.chatService.getUserConversations(userId);
        } else {
          return of([]); // Return empty array if no user is logged in
        }
      })
    );
  }

  getOtherParticipantName(conv: Conversation): string {
    if (!this.currentUserId) return 'Usuário';
    return this.currentUserId === conv.owner_user_id ? conv.interested_user_nome : conv.owner_nome;
  }
}
