import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  router      = inject(Router);

  get userName():    string  { return this.authService.getUserName(); }
  get userRole():    string  { return this.authService.getRole() ?? 'User'; }
  get isAdmin():     boolean { return this.authService.isAdmin(); }
  get cartCount():   number  { return this.cartService.totalItems(); }

  logout(): void { this.authService.logout(); }
}