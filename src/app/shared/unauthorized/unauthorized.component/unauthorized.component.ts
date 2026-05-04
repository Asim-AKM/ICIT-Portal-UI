import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  dashboardLink: string = '/';
  
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    const user = this.authService.getStoredUser();
    if (user) {
      const dashboardRoutes: Record<string, string> = {
        Admin: '/admin-dashboard',
        Faculty: '/faculty-dashboard',
        Clerk: '/clerk-dashboard',
        Student: '/student-dashboard'
      };
      this.dashboardLink = dashboardRoutes[user.role] || '/';
    }
  }

  goBack() {
    window.history.back();
  }
}