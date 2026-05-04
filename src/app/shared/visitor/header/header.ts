import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isMenuOpen = false;

  constructor(
    public router: Router,
    public authService: AuthService
  ) {}

  // ✅ Dashboard link based on role
  getDashboardLink(): string {
    const user = this.authService.getStoredUser();
    if (!user) return '/login';

    const dashboardRoutes: Record<string, string> = {
      Admin: '/admin-dashboard',
      Faculty: '/faculty-dashboard',
      Clerk: '/clerk-dashboard',
      Student: '/student-dashboard'
    };
    return dashboardRoutes[user.role] || '/';
  }

  isActive(route: string): boolean {
    if (route === '/' && this.router.url === '/') {
      return true;
    }
    if (route !== '/' && this.router.url.startsWith(route)) {
      return true;
    }
    return false;
  }
}