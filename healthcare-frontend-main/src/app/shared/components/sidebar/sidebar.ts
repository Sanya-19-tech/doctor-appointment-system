import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  authService = inject(AuthService);

  navItems: NavItem[] = [
    { label: 'Dashboard',    route: '/dashboard'    },
    { label: 'Patients',     route: '/patients'     },
    { label: 'Doctors',      route: '/doctors'      },
    { label: 'Appointments', route: '/appointments' },
    { label: 'Medicines',    route: '/medicines'    },
    { label: 'Orders',       route: '/orders'       },
  ];

  get visibleItems(): NavItem[] { return this.navItems; }
  get isAdmin(): boolean { return this.authService.isAdmin(); }
}