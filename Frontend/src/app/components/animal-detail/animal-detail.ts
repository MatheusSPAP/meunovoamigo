import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal.model';
import { UsuarioService } from '../../usuario.service';
import { Subscription, forkJoin } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { InteresseAdocaoService } from '../../services/interesse-adocao.service';

@Component({
  selector: 'app-animal-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animal-detail.html',
  styleUrls: ['./animal-detail.css']
})
export class AnimalDetailComponent implements OnInit, OnDestroy {
  animal: Animal | undefined;
  successMessage: string = '';
  errorMessage: string = '';
  currentUserId: number | null = null;
  apiBaseUrl = 'http://localhost:3000';
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private chatService: ChatService,
    private interesseAdocaoService: InteresseAdocaoService
  ) { }

  ngOnInit(): void {
    const routeSub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.animalService.getAnimalById(id).subscribe((response: any) => {
          this.animal = response.data;
        });
      }
    });

    const userSub = this.usuarioService.currentUserId$.subscribe(userId => {
      this.currentUserId = userId;
    });

    this.subscription.add(routeSub);
    this.subscription.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  startChat(): void {
    if (!this.currentUserId || !this.animal) {
      this.errorMessage = 'Você precisa estar logado para iniciar uma conversa.';
      return;
    }

    const interesseData = {
      mensagem: 'Tenho interesse em adotar este animal.',
      usuario_idusuario: this.currentUserId,
      animal_idAnimal: this.animal.idAnimal
    };

    const createInteresse$ = this.interesseAdocaoService.createInteresseAdocao(interesseData);
    const startConversation$ = this.chatService.startConversation(this.animal.idAnimal, this.currentUserId);

    forkJoin([createInteresse$, startConversation$]).subscribe({
      next: ([interesseResult, conversation]) => {
        console.log('Interesse criado:', interesseResult);
        this.router.navigate(['/mensagens', conversation.id]);
      },
      error: (error) => {
        // Check if the error is because the interest already exists
        if (error.error && error.error.message && error.error.message.includes('já manifestou interesse')) {
          // If interest already exists, just start the chat
          this.chatService.startConversation(this.animal!.idAnimal, this.currentUserId!).subscribe(conversation => {
            this.router.navigate(['/mensagens', conversation.id]);
          });
        } else {
          this.errorMessage = error.error.message || 'Erro ao iniciar a conversa. Tente novamente.';
        }
      }
    });
  }
}
