import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  // Clone request and add authorization header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si recibimos 401 y hay refresh token, intentar refrescarlo
      if (
        error.status === 401 &&
        auth.getRefreshToken() &&
        !req.url.includes('/auth/')
      ) {
        return auth.refreshToken().pipe(
          switchMap((res) => {
            // Reintentar la petición con el nuevo token
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`,
              },
            });
            return next(newReq);
          }),
          catchError((refreshError) => {
            // Si falla el refresh, limpiar tokens y redirigir a login
            auth.clearTokens();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          }),
        );
      }

      // Si es 401 y no hay refresh token, redirigir a login
      if (error.status === 401) {
        auth.clearTokens();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
