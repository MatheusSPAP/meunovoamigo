import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  registroForm: FormGroup;
  showLoginForm: boolean = true;
  loginErrorMessage: string = '';
  registroErrorMessage: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required])
    });

    this.registroForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      cidade: new FormControl('', [Validators.required]),
      endereco: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    // Se o usuário já estiver logado, redireciona para o dashboard
    if (this.usuarioService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleForm(): void {
    this.showLoginForm = !this.showLoginForm;
    this.loginErrorMessage = '';
    this.registroErrorMessage = '';
    this.loginForm.reset();
    this.registroForm.reset();
  }

  onSubmitLogin(): void {
    this.loginErrorMessage = '';
    if (this.loginForm.valid) {
      this.usuarioService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.loginErrorMessage = response.message || 'Erro ao fazer login.';
          }
        },
        error: (error) => {
          console.error('Erro de login:', error);
          this.loginErrorMessage = error.error?.message || 'Erro de conexão. Tente novamente.';
        }
      });
    } else {
      this.loginErrorMessage = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }

  onSubmitRegistro(): void {
    this.registroErrorMessage = '';
    if (this.registroForm.valid) {
      this.usuarioService.registrarUsuario(this.registroForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/dashboard']); // Ou redirecionar para login
          }
        },
        error: (error) => {
          console.error('Erro ao registrar usuário!', error);
          this.registroErrorMessage = error.error?.message || 'Erro ao registrar usuário. Tente novamente.';
        }
      });
    } else {
      this.registroErrorMessage = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }
}
