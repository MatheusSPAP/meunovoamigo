import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private usuarioService: UsuarioService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.usuarioService.getToken();
    const isApiUrl = req.url.startsWith('http://localhost:3000/api');

    if (token && isApiUrl) {
      // Exclude public routes from having the token
      if (req.url.endsWith('/login') ||
          (req.url.endsWith('/usuarios') && req.method === 'POST') ||
          req.url.includes('/animais') && req.method === 'GET') {
        return next.handle(req);
      }

      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
