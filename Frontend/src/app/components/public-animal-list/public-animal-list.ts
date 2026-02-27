import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-public-animal-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="public-animal-container">
      <header class="public-header">
        <h1>Adote um Novo Amigo</h1>
        <p>Conheça os animais que estão esperando por um lar cheio de amor</p>
        <div class="mission-statement">
          <p>Nossa missão é conectar animais que precisam de um lar a pessoas que desejam dar e receber amor. Acreditamos que toda vida é preciosa e que, juntos, podemos transformar o destino de muitos bichinhos.</p>
        </div>

        <!-- Contadores de Estatísticas -->
        <div class="stats-counters">
          <div class="counter">
            <span class="count">{{ availableCount }}</span>
            <span class="label">Amigos esperando um lar</span>
          </div>
          <div class="counter">
            <span class="count">{{ adoptedCount }}</span>
            <span class="label">Finais felizes</span>
          </div>
        </div>

        <div class="auth-links">
          <a routerLink="/login" class="btn-login">Já tenho uma conta</a>
          <a routerLink="/login" class="btn-register">Quero me cadastrar</a>
        </div>
      </header>

      <div class="loading" *ngIf="isLoading">Carregando animais...</div>

      <div class="animals-grid">
        <div *ngFor="let animal of animais" class="animal-card">
          <img [src]="apiBaseUrl + '/' + animal.foto" [alt]="animal.nome" class="animal-image" (error)="onImageError($event)">
          <div class="animal-info">
            <h3>{{ animal.nome }}</h3>
            <p class="animal-details">
              <span class="tag">{{ animal.sexo === 'M' ? 'Macho' : 'Fêmea' }}</span>
              <span class="tag">{{ animal.tipo_idtipo_animal === 1 ? 'Cachorro' : 'Gato' }}</span>
              <span class="tag">{{ animal.tamanho_animal_idtamanho_animal === 1 ? 'Pequeno' : animal.tamanho_animal_idtamanho_animal === 2 ? 'Médio' : 'Grande' }}</span>
            </p>
            <p class="animal-description">{{ animal.descricao }}</p>
            <div class="animal-features">
              <span class="feature" *ngIf="animal.vacinado">✓ Vacinado</span>
              <span class="feature" *ngIf="animal.castrado">✓ Castrado</span>
            </div>
          </div>
          <div class="animal-actions">
            <a [routerLink]="['/login']" class="btn-details" title="Faça login ou registre-se para ver detalhes e demonstrar interesse">Ver detalhes</a>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && animais.length === 0" class="no-animals">
        <p>Nenhum animal disponível no momento.</p>
      </div>

      <div *ngIf="error" class="error">
        <p>Erro ao carregar os animais: {{ error }}</p>
      </div>

      <!-- Seção Ajude-nos a Crescer -->
      <div class="cta-shelter">
        <h2>Você é um protetor ou representa um abrigo?</h2>
        <p>Junte-se a nós e encontre lares amorosos para seus animais. Cadastre-se gratuitamente e gerencie suas adoções de forma simples e eficaz.</p>
        <a routerLink="/login" class="btn-cta">Quero Cadastrar Meus Animais</a>
      </div>
    </div>
  `,
  styleUrls: ['./public-animal-list.css']
})
export class PublicAnimalListComponent implements OnInit {
  animais: Animal[] = [];
  apiBaseUrl = 'http://localhost:3000';
  isLoading = true;
  error: string | null = null;
  adoptedCount: number = 0;
  availableCount: number = 0;

  constructor(private animalService: AnimalService) {}

  ngOnInit(): void {
    this.loadAvailableAnimals();
    this.loadStats();
  }

  loadAvailableAnimals(): void {
    // Carrega apenas animais disponíveis
    this.animalService.getAnimais({ status: 'Disponível' }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.animais = response.data;
        } else {
          this.error = response.message || 'Nenhum dado retornado';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.message || 'Erro ao carregar os animais';
        console.error('Erro ao carregar animais disponíveis:', error);
      }
    });
  }

  loadStats(): void {
    this.animalService.getStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.adoptedCount = response.data.adotado || 0;
          this.availableCount = response.data.disponivel || 0;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder-animal.jpg'; // Placeholder image
  }
}