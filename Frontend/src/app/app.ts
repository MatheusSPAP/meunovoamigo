import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false;
  currentUserName: string | null = null; // Adicionado para armazenar o nome do usuário
  private authSubscription: Subscription | undefined; // Initialize to undefined

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.authSubscription = this.usuarioService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isUserLoggedIn = loggedIn;
        if (loggedIn) {
          const userId = localStorage.getItem('currentUserId');
          if (userId) {
            this.usuarioService.getUserProfile(Number(userId)).subscribe({
              next: (response: any) => {
                if (response.success && response.data && response.data.nome) {
                  this.currentUserName = response.data.nome;
                }
              },
              error: (error) => {
                console.error('Erro ao carregar perfil do usuário:', error);
                this.currentUserName = null; // Limpa o nome em caso de erro
              }
            });
          }
        } else {
          this.currentUserName = null; // Limpa o nome se o usuário deslogar
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  isLoggedIn(): boolean {
    return this.isUserLoggedIn;
  }

  logout(): void {
    this.usuarioService.logout();
  }
}