import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Route data carries expected role e.g: data: { role: 'Admin' }
  const expectedRole = route.data?.['role'];
  const userRole = authService.getRole();

  if (userRole === expectedRole) {
    return true;
  }

  // Wrong role → back to dashboard
  router.navigate(['/dashboard']);
  return false;
};