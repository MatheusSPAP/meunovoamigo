import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { UsuarioService } from '../../usuario.service';
import { Message } from '../../models/message.model';
import { Conversation } from '../../models/conversation.model';
import { Subscription, forkJoin, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-window.html',
  styleUrls: ['./chat-window.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  conversation: Conversation | null = null;
  currentUserId: number | null = null;
  messageForm: FormGroup;
  private conversationId!: number;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private usuarioService: UsuarioService
  ) {
    this.messageForm = new FormGroup({
      messageText: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    const userSub = this.usuarioService.currentUserId$.subscribe(id => this.currentUserId = id);

    const routeSub = this.route.paramMap.pipe(
      switchMap(params => {
        this.conversationId = Number(params.get('id'));
        if (this.conversationId) {
          const conversation$ = this.chatService.getConversationById(this.conversationId);
          const messages$ = this.chatService.getConversationMessages(this.conversationId);
          return forkJoin({ conversation: conversation$, messages: messages$ });
        } else {
          return of(null);
        }
      })
    ).subscribe(data => {
      if (data) {
        this.conversation = data.conversation;
        this.messages = data.messages;
      }
    });

    this.subscriptions.add(userSub);
    this.subscriptions.add(routeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadMessages(): void {
    this.chatService.getConversationMessages(this.conversationId).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid || !this.currentUserId || !this.conversation) return;

    const receiverId = this.currentUserId === this.conversation.owner_user_id 
      ? this.conversation.interested_user_id 
      : this.conversation.owner_user_id;

    const messageData = {
      sender_id: this.currentUserId,
      receiver_id: receiverId,
      message_text: this.messageForm.value.messageText
    };

    this.chatService.postMessage(this.conversationId, messageData).subscribe(() => {
      this.messageForm.reset();
      this.loadMessages(); // Reload messages after sending
    });
  }
}
