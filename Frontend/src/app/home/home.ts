import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  showLoginForm: boolean = true; // true for login, false for register

  // Login Form
  loginForm: FormGroup;
  loginErrorMessage: string = '';

  // Register Form
  registroForm: FormGroup;
  registroErrorMessage: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    // Initialize Login Form
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required])
    });

    // Initialize Register Form
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
    // If user is already logged in, redirect to /dashboard
    if (this.usuarioService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleForm(): void {
    this.showLoginForm = !this.showLoginForm;
    this.loginErrorMessage = ''; // Clear errors when switching forms
    this.registroErrorMessage = ''; // Clear errors when switching forms
  }

  onSubmitLogin(): void {
    this.loginErrorMessage = '';
    if (this.loginForm.valid) {
      this.usuarioService.login(this.loginForm.value)
        .subscribe({
          next: (response) => {
            console.log('Login successful!', response);
            // Force change detection after localStorage is set
            this.cdr.detectChanges(); // Explicitly trigger change detection
            this.router.navigate(['/dashboard']); // Redirect to dashboard page after login
          },
          error: (error) => {
            console.error('Login failed!', error);
            this.loginErrorMessage = error.error.message || 'Erro ao fazer login. Verifique suas credenciais.';
          }
        });
    } else {
      this.loginErrorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }

  onSubmitRegistro(): void {
    this.registroErrorMessage = '';
    if (this.registroForm.valid) {
      this.usuarioService.registrarUsuario(this.registroForm.value)
        .subscribe({
          next: (response) => {
            console.log('Usuário registrado com sucesso!', response);
            this.registroErrorMessage = 'Usuário registrado com sucesso! Faça login para continuar.';
            this.registroForm.reset(); // Clear form
            this.showLoginForm = true; // Switch to login form
          },
          error: (error) => {
            console.error('Erro ao registrar usuário!', error);
            this.registroErrorMessage = error.error.message || 'Erro ao registrar usuário. Tente novamente.';
          }
        });
    } else {
      this.registroErrorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }
}
