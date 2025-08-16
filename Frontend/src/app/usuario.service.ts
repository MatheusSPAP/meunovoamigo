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
  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasUserId());

  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private hasUserId(): boolean {
    return !!localStorage.getItem('currentUserId');
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.success && response.data && response.data.idusuario) {
          localStorage.setItem('currentUserId', response.data.idusuario);
          this._isLoggedIn.next(true);
        }
      })
    );
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  updateUserProfile(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  logout(): void {
    localStorage.removeItem('currentUserId');
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
