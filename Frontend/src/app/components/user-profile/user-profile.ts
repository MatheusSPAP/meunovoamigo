import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../usuario.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {
  user: any | undefined;
  errorMessage: string = '';
  successMessage: string = '';
  isEditMode: boolean = false;
  profileForm: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.profileForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required]),
      cidade: new FormControl('', [Validators.required]),
      endereco: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      this.usuarioService.getUserProfile(Number(userId)).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.user = response.data;
            // Populate the form with current user data
            this.profileForm.patchValue({
              nome: this.user.nome,
              email: this.user.email,
              telefone: this.user.telefone,
              cidade: this.user.cidade,
              endereco: this.user.endereco
            });
          } else {
            this.errorMessage = response.message || 'Erro ao carregar perfil.';
          }
        },
        error: (error) => {
          console.error('Erro ao carregar perfil!', error);
          this.errorMessage = 'Erro ao carregar perfil. Por favor, tente novamente.';
        }
      });
    } else {
      this.errorMessage = 'Usuário não logado. Redirecionando para o login...';
      this.router.navigate(['/login']);
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.isEditMode && this.user) {
      // If exiting edit mode, reset form to original user data
      this.profileForm.patchValue({
        nome: this.user.nome,
        email: this.user.email,
        telefone: this.user.telefone,
        cidade: this.user.cidade,
        endereco: this.user.endereco
      });
    }
  }

  onSubmitProfile(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.profileForm.valid && this.user) {
      const userId = localStorage.getItem('currentUserId');
      if (!userId) {
        this.errorMessage = 'Erro: ID do usuário não encontrado.';
        return;
      }

      const updatedData = {
        ...this.profileForm.value,
      };

      this.usuarioService.updateUserProfile(Number(userId), updatedData).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Perfil atualizado com sucesso!';
            this.isEditMode = false; // Exit edit mode
            this.loadUserProfile(); // Reload user data to ensure consistency
          } else {
            this.errorMessage = response.message || 'Erro ao atualizar perfil.';
          }
        },
        error: (error) => {
          console.error('Erro ao atualizar perfil!', error);
          this.errorMessage = error.error.message || 'Erro ao atualizar perfil. Tente novamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }
}
