import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalService } from '../../services/animal.service';
import { InteresseAdocaoService } from '../../services/interesse-adocao.service';
import { Animal } from '../../models/animal.model';
import { InteresseAdocao } from '../../models/interesse-adocao.model';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../usuario.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUserId: number | null = null;
  currentUserName: string | null = null;
  userAnimals: Animal[] = [];
  interessesRecebidos: InteresseAdocao[] = [];
  interessesManifestados: InteresseAdocao[] = [];
  pendingInterestsCount: number = 0;
  manifestedInterestsSummary: { aguardando: number, aprovado: number, recusado: number } = { aguardando: 0, aprovado: 0, recusado: 0 };
  recentPosts: Post[] = [];
  upcomingEvents: Evento[] = [];
  errorMessage: string = '';
  private subscription = new Subscription();

  constructor(
    private animalService: AnimalService,
    private interesseAdocaoService: InteresseAdocaoService,
    private usuarioService: UsuarioService,
    private postService: PostService,
    private eventoService: EventoService
  ) { }

  ngOnInit(): void {
    const userSub = this.usuarioService.currentUserId$.subscribe(userId => {
      if (userId) {
        this.currentUserId = userId;
        this.loadDashboardData();
      } else {
        this.currentUserId = null;
        this.errorMessage = 'Você precisa estar logado para ver o dashboard.';
      }
    });

    const nameSub = this.usuarioService.currentUserName$.subscribe(name => {
      this.currentUserName = name;
    });

    this.subscription.add(userSub);
    this.subscription.add(nameSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadDashboardData(): void {
    if (!this.currentUserId) return;

    this.animalService.getAnimalsByOwnerId(this.currentUserId).subscribe({
      next: (response: any) => { this.userAnimals = response.data; },
      error: (error) => {
        console.error('Erro ao carregar animais do usuário:', error);
        this.errorMessage = 'Erro ao carregar seus animais.';
      }
    });

    this.interesseAdocaoService.getInteressesByDonoAnimal(this.currentUserId).subscribe({
      next: (response: any) => {
        this.interessesRecebidos = response.data;
        this.calculatePendingInterests();
      },
      error: (error) => {
        console.error('Erro ao carregar interesses recebidos:', error);
        this.errorMessage = 'Erro ao carregar interesses de adoção.';
      }
    });

    this.interesseAdocaoService.getInteressesByUsuario(this.currentUserId).subscribe({
      next: (response: any) => {
        this.interessesManifestados = response.data;
        this.calculateManifestedInterestsSummary();
      },
      error: (error) => {
        console.error('Erro ao carregar interesses manifestados:', error);
        this.errorMessage = 'Erro ao carregar seus interesses manifestados.';
      }
    });

    this.postService.getPosts().subscribe({
      next: (response: any) => { this.recentPosts = response.data.slice(0, 3); },
      error: (error) => {
        console.error('Erro ao carregar postagens recentes:', error);
        this.errorMessage = 'Erro ao carregar postagens recentes.';
      }
    });

    const today = new Date().toISOString().slice(0, 10);
    this.eventoService.getEventosByPeriodo(today, '', 'asc').subscribe({
      next: (response: any) => { this.upcomingEvents = response.data.slice(0, 3); },
      error: (error) => {
        console.error('Erro ao carregar próximos eventos:', error);
        this.errorMessage = 'Erro ao carregar próximos eventos.';
      }
    });
  }

  calculatePendingInterests(): void {
    this.pendingInterestsCount = this.interessesRecebidos.filter(
      interesse => interesse.interesse_status === 'Aguardando'
    ).length;
  }

  calculateManifestedInterestsSummary(): void {
    this.manifestedInterestsSummary = {
      aguardando: this.interessesManifestados.filter(i => i.interesse_status === 'Aguardando').length,
      aprovado: this.interessesManifestados.filter(i => i.interesse_status === 'Aprovado').length,
      recusado: this.interessesManifestados.filter(i => i.interesse_status === 'Recusado').length,
    };
  }
}
