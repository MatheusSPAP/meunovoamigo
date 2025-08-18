import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';

interface LoginFormValue {
  email: string;
  senha: string;
}

interface RegistroFormValue {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cidade: string;
  endereco: string;
}

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
  registroSuccessMessage: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      senha: new FormControl('', { validators: [Validators.required], nonNullable: true })
    });

    // A estrutura do FormGroup espera um objeto de FormControls. A tipagem explícita aqui resolve a ambiguidade.
    this.registroForm = new FormGroup({
      nome: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      senha: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      telefone: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      cidade: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      endereco: new FormControl('', { validators: [Validators.required], nonNullable: true })
    });
  }

  ngOnInit(): void {}

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
      this.usuarioService.login(this.loginForm.getRawValue()).subscribe({
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
    this.registroSuccessMessage = '';
    if (this.registroForm.valid) {
      this.usuarioService.registrarUsuario(this.registroForm.getRawValue()).subscribe({
        next: (response) => {
          if (response.success) {
            this.toggleForm();
            this.registroSuccessMessage = 'Registro realizado com sucesso! Faça o login para continuar.';
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