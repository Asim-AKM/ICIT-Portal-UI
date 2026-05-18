import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Header } from './shared/visitor/header/header';
import { Footer } from './shared/visitor/footer/footer';
import { CommonModule } from '@angular/common';
import { AdminHeader } from './shared/admin/admin-header/admin-header';
import { filter, take } from 'rxjs/operators';
import { StudentHeader } from './shared/student/student-header/student-header';
import { ClerkHeader } from "./shared/clerk/clerk-header/clerk-header";
import { FacultyHeader } from "./shared/faculty/faculty-header/faculty-header";
import { DashboardFooter } from './shared/dasboards/dashboard-footer/dashboard-footer';
import { AuthService } from './core/services/auth-services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Footer,
    AdminHeader,
    StudentHeader,
    CommonModule,
    ClerkHeader,
    FacultyHeader,
    DashboardFooter
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('ICIT-Portal');
  currentLayout: string = 'visitor';

  private authService = inject(AuthService);

  constructor(public router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLayout();
    });
  }

ngOnInit() {
  this.authService.authReady$.pipe(
    filter(ready => ready),
    take(1)
  ).subscribe(() => {
    const user = this.authService.getStoredUser();
    const currentPath = window.location.pathname;
    
    console.log('📍 App Init - Path:', currentPath, 'User:', !!user);

    if (user) {
      // ✅ Sirf /login se dashboard bhejo, / ko visitor rehne do
      if (currentPath === '/login') {
        const dashboardRoutes: Record<string, string> = {
          Admin: '/admin-dashboard',
          Faculty: '/faculty-dashboard',
          Clerk: '/clerk-dashboard',
          Student: '/student-dashboard'
        };
        const target = dashboardRoutes[user.role] || '/';
        console.log('➡️ Redirecting to:', target);
        this.router.navigateByUrl(target, { replaceUrl: true });
      }
      // ✅ Agar kisi protected route pe refresh hua → wahi raho
      else if (currentPath !== '/') {
        console.log('📍 Staying at:', currentPath);
        this.router.navigateByUrl(currentPath, { replaceUrl: true });
      }
      // ✅ Agar / hai → visitor page allow karo
      else {
        console.log('🏠 Home page - OK');
      }
    } else {
      // ⚠️ User null hai → public routes allow, baaki login par
      // ✅ BUT /login ko force allow karo (logout ke baad yahi aana chahiye)
      if (currentPath === '/login') {
        console.log('✅ Login page - OK');
        this.router.navigateByUrl('/login', { replaceUrl: true });
        return;
      }
      
      const publicRoutes = ['/', '/about', '/events', '/download', '/explore', '/forget-pass'];
      if (!publicRoutes.includes(currentPath)) {
        console.log('🚫 Protected route without login → /login');
        this.router.navigateByUrl('/login', { replaceUrl: true });
      } else {
        console.log('✅ Public route - OK');
        this.router.navigateByUrl(currentPath, { replaceUrl: true });
      }
    }
  });
}


  getLayoutType(): string {
    return this.currentLayout;
  }

private updateLayout() {
  const url = this.router.url;

  const layoutGroups = {
    'none': ['/login'],
    'unauthorized': ['/unauthorized'],
    
    'admin-header': [
      '/admin-dashboard', '/users', '/add-user',
      '/announcement', '/bulk-student-verification', '/student-verification',
      '/session-details', '/add-sessions', '/edit-user'
    ],
    'student-header': [
      '/student-dashboard', '/semester-details', '/fee-records',
      '/fyp-proposal', '/student-transcript', '/student-notifications'
    ],
    'clerk-header': [
      '/clerk-dashboard', '/single-enrollment', '/bulk-enrollment',
      '/fee-collection', '/student-records', '/generate-challan',
      '/fee-collection-reports', '/student-reports', '/assign-subject',
      '/semester-promotion'
    ],
    'faculty-header': [
      '/faculty-dashboard', '/project-evaluation', '/assign-grade'
    ]
  };

  for (const [layout, routes] of Object.entries(layoutGroups)) {
    if (routes.some(route => url.startsWith(route))) {
      this.currentLayout = layout;
      return;
    }
  }

  // ✅ Common routes — role-based layout
  const commonRoutes = ['/profile', '/notification-view', '/notifications-center'];
  if (commonRoutes.some(route => url.startsWith(route))) {
    const user = this.authService.getStoredUser();
    if (user) {
      const roleLayoutMap: Record<string, string> = {
        'Admin': 'admin-header',
        'Faculty': 'faculty-header',
        'Clerk': 'clerk-header',
        'Student': 'student-header'
      };
      this.currentLayout = roleLayoutMap[user.role] || 'visitor';
      return;
    }
  }

  this.currentLayout = 'visitor';
}
}