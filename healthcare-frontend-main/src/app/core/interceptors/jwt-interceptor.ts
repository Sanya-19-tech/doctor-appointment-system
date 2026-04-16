import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // ─── CLONE REQUEST WITH TOKEN ──────────────────────
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  // ─── HANDLE ERRORS ────────────────────────────────
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Not logged in → redirect to login
        authService.logout();
        router.navigate(['/login']);
      }
      if (error.status === 403) {
        // Forbidden → redirect to dashboard
        router.navigate(['/dashboard']);
      }
      return throwError(() => error);
    })
  );
};