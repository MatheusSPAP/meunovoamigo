import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    
    return this.usuarioService.isLoggedIn$.pipe(
      take(1), // Pega o valor mais recente e completa
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        }
        // Redireciona para a página de login se não estiver logado
        return this.router.createUrlTree(['/']);
      })
    );
  }
}
