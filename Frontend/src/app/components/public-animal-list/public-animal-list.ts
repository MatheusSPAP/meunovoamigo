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
    </div>
  `,
  styleUrls: ['./public-animal-list.css']
})
export class PublicAnimalListComponent implements OnInit {
  animais: Animal[] = [];
  apiBaseUrl = 'http://localhost:3000';
  isLoading = true;
  error: string | null = null;

  constructor(private animalService: AnimalService) {}

  ngOnInit(): void {
    this.loadAvailableAnimals();
  }

  loadAvailableAnimals(): void {
    // Carrega apenas animais disponíveis
    this.animalService.getAnimais({ status: 'Disponível' }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.animais = response.data;
          console.log('Animais carregados:', response.data);
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

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder-animal.jpg'; // Placeholder image
  }
}