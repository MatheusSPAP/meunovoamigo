import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { UsuarioService } from './usuario.service';
import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

// Função de fábrica para o APP_INITIALIZER
export function initializeAuth(usuarioService: UsuarioService): () => Promise<any> {
  return () =>
    new Promise<void>((resolve) => {
      const userId = sessionStorage.getItem('currentUserId');
      const token = sessionStorage.getItem('token');

      if (userId && token) {
        usuarioService
          .getUserProfile(Number(userId))
          .pipe(
            switchMap((response: any) => {
              if (response.success && response.data) {
                usuarioService.setAuthState(true, response.data.nome, response.data.idusuario);
              } else {
                usuarioService.logout(); // Se o perfil falhar, deslogue
              }
              return of(null);
            }),
            catchError(() => {
              usuarioService.logout(); // Se houver erro, deslogue
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
    UsuarioService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [UsuarioService],
      multi: true,
    },
  ],
};