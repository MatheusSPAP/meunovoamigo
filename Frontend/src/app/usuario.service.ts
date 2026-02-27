import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  private _currentUserName = new BehaviorSubject<string | null>(null);
  private _currentUserId = new BehaviorSubject<number | null>(null); // Added

  isLoggedIn$ = this._isLoggedIn.asObservable();
  currentUserName$ = this._currentUserName.asObservable();
  currentUserId$ = this._currentUserId.asObservable(); // Added

  constructor(private http: HttpClient, private router: Router) {
    // Verifica se o usuário está logado ao inicializar o serviço
    this.checkLoginStatus();
  }

  private checkLoginStatus(): void {
    const userIdFromStorage = sessionStorage.getItem('currentUserId');
    if (userIdFromStorage) {
      // Verifica se o token ainda é válido fazendo uma requisição simples
      // Por enquanto, apenas restauramos o estado com base no ID armazenado
      const userId = Number(userIdFromStorage);
      if (!isNaN(userId)) {
        // Não podemos definitivamente confirmar se o token é válido sem fazer uma requisição,
        // mas vamos assumir que se o ID está armazenado, o usuário estava logado
        this.setAuthState(true, null, userId);
      }
    }
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  updateUserProfile(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }

  updateUserPassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/password`, { currentPassword, newPassword });
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  // Modified to accept userId
  setAuthState(isLoggedIn: boolean, userName: string | null = null, userId: number | null = null) {
    this._isLoggedIn.next(isLoggedIn);
    this._currentUserName.next(userName);
    this._currentUserId.next(userId);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.success && response.token && response.data && response.data.idusuario) {
          sessionStorage.setItem('token', response.token); // Store token
          sessionStorage.setItem('currentUserId', response.data.idusuario);
          this.setAuthState(true, response.data.nome, response.data.idusuario);
        }
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token'); // Remove token
    sessionStorage.removeItem('currentUserId');
    this.setAuthState(false, null, null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}