import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

// Função de fábrica para o APP_INITIALIZER
export function initializeAuth(usuarioService: UsuarioService): () => Promise<any> {
  return () =>
    new Promise<void>((resolve) => {
      const userId = sessionStorage.getItem('currentUserId');
      if (userId) {
        usuarioService
          .getUserProfile(Number(userId))
          .pipe(
            switchMap((response: any) => {
              if (response.success && response.data) {
                usuarioService.setAuthState(true, response.data.nome, response.data.idusuario);
              } else {
                usuarioService.setAuthState(false);
              }
              return of(null);
            }),
            catchError(() => {
              usuarioService.setAuthState(false);
              return of(null);
            })
          )
          .subscribe(() => resolve());
      } else {
        usuarioService.setAuthState(false);
        resolve();
      }
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [UsuarioService],
      multi: true,
    },
  ],
};