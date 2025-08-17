import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalService } from '../../services/animal.service';
import { InteresseAdocaoService } from '../../services/interesse-adocao.service';
import { Animal } from '../../models/animal.model';
import { InteresseAdocao } from '../../models/interesse-adocao.model';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../usuario.service'; // Importar UsuarioService

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  currentUserId: number | null = null;
  currentUserName: string | null = null; // Adicionado para o nome do usuário
  userAnimals: Animal[] = [];
  interessesRecebidos: InteresseAdocao[] = [];
  pendingInterestsCount: number = 0;
  errorMessage: string = '';

  constructor(
    private animalService: AnimalService,
    private interesseAdocaoService: InteresseAdocaoService,
    private usuarioService: UsuarioService // Injetar UsuarioService
  ) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      this.currentUserId = Number(userId);
      this.loadDashboardData();
      this.loadUserName(); // Carregar o nome do usuário
    } else {
      this.errorMessage = 'Você precisa estar logado para ver o dashboard.';
    }
  }

  loadDashboardData(): void {
    if (this.currentUserId) {
      // Carregar animais do usuário
      this.animalService.getAnimalsByOwnerId(this.currentUserId).subscribe({
        next: (response: any) => {
          this.userAnimals = response.data;
        },
        error: (error) => {
          console.error('Erro ao carregar animais do usuário:', error);
          this.errorMessage = 'Erro ao carregar seus animais.';
        }
      });

      // Carregar interesses de adoção recebidos
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
    }
  }

  loadUserName(): void {
    if (this.currentUserId) {
      this.usuarioService.getUserProfile(this.currentUserId).subscribe({
        next: (response: any) => {
          if (response.success && response.data && response.data.nome) {
            this.currentUserName = response.data.nome;
          }
        },
        error: (error) => {
          console.error('Erro ao carregar nome do usuário:', error);
          this.currentUserName = null;
        }
      });
    }
  }

  calculatePendingInterests(): void {
    this.pendingInterestsCount = this.interessesRecebidos.filter(
      interesse => interesse.interesse_status === 'Aguardando'
    ).length;
  }
}