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

  constructor(private http: HttpClient, private router: Router) { }

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
        if (response.success && response.data && response.data.idusuario) {
          sessionStorage.setItem('currentUserId', response.data.idusuario);
          // Use the new setAuthState
          this.setAuthState(true, response.data.nome, response.data.idusuario);
        }
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('currentUserId'); // Corrected from localStorage
    this.setAuthState(false, null, null); // Use the new setAuthState
    this.router.navigate(['/']);
  }
}