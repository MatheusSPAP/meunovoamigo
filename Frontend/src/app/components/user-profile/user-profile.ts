import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../usuario.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

// Custom Validator for password matching
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return newPassword && confirmPassword && newPassword.value !== confirmPassword.value ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: any | undefined;
  errorMessage: string = '';
  successMessage: string = '';
  isEditMode: boolean = false;
  profileForm: FormGroup;
  passwordForm: FormGroup;

  private currentUserId: number | null = null;
  private subscription = new Subscription();

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

    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    const userSub = this.usuarioService.currentUserId$.subscribe(userId => {
      this.currentUserId = userId;
      if (userId) {
        this.loadUserProfile(userId);
      } else {
        this.errorMessage = 'Usuário não logado. Redirecionando para o login...';
        this.router.navigate(['/login']);
      }
    });
    this.subscription.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadUserProfile(userId: number): void {
    this.usuarioService.getUserProfile(userId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.user = response.data;
          this.profileForm.patchValue(this.user);
        } else {
          this.errorMessage = response.message || 'Erro ao carregar perfil.';
        }
      },
      error: (error) => {
        console.error('Erro ao carregar perfil!', error);
        this.errorMessage = 'Erro ao carregar perfil. Por favor, tente novamente.';
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.isEditMode && this.user) {
      this.profileForm.patchValue(this.user);
    }
  }

  onSubmitProfile(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.profileForm.valid && this.currentUserId) {
      this.usuarioService.updateUserProfile(this.currentUserId, this.profileForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Perfil atualizado com sucesso!';
            this.isEditMode = false;
            this.loadUserProfile(this.currentUserId!);
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

  onSubmitPassword(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.passwordForm.valid && this.currentUserId) {
      const passwords = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.usuarioService.updateUserPassword(this.currentUserId, this.passwordForm.value.currentPassword, this.passwordForm.value.newPassword).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Senha alterada com sucesso!';
            this.passwordForm.reset();
          } else {
            this.errorMessage = response.message || 'Erro ao alterar a senha.';
          }
        },
        error: (error) => {
          console.error('Erro ao alterar a senha!', error);
          this.errorMessage = error.error.message || 'Erro ao alterar a senha. Tente novamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos de senha corretamente.';
    }
  }
}
