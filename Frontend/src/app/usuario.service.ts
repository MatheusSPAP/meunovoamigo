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

  isLoggedIn$ = this._isLoggedIn.asObservable();
  currentUserName$ = this._currentUserName.asObservable();

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

  // Método síncrono para verificações rápidas em componentes, se necessário
  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  setAuthState(isLoggedIn: boolean, userName: string | null = null) {
    this._isLoggedIn.next(isLoggedIn);
    this._currentUserName.next(userName);
  }

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.success && response.data && response.data.idusuario) {
          localStorage.setItem('currentUserId', response.data.idusuario);
          this._isLoggedIn.next(true);
          this._currentUserName.next(response.data.nome); // Set the user's name here
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUserId');
    this._isLoggedIn.next(false);
    this._currentUserName.next(null);
    this.router.navigate(['/']); // Redireciona para a home (login)
  }
}
