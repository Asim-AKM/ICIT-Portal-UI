import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Header } from './shared/visitor/header/header';
import { Footer } from './shared/visitor/footer/footer';
import { CommonModule } from '@angular/common';
import { AdminHeader } from './shared/admin/admin-header/admin-header';
import { filter } from 'rxjs/operators';
import { StudentHeader } from './shared/student/student-header/student-header';
import { ClerkHeader } from "./shared/clerk/clerk-header/clerk-header";
import { FacultyHeader } from "./shared/faculty/faculty-header/faculty-header";
import { DashboardFooter } from './shared/dasboards/dashboard-footer/dashboard-footer';

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
export class App {
  protected readonly title = signal('ICIT-Portal');
  currentLayout: string = 'visitor';
  
  constructor(public router: Router) {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLayout();
    });
  }
  
  getLayoutType(): string {
    return this.currentLayout;
  }
  
private updateLayout() {
  const url = this.router.url;
  
  // Define route groups
  const layoutGroups = {
    'none': ['/login'],
    'admin-header': [
      '/admin-dashboard', '/users', '/add-user', '/admin-profile',
      '/announcement', '/bulk-student-verification', '/student-verification',
      '/session-details', '/add-sessions'
    ],
    'student-header': [
      '/student-dashboard', '/semester-details', '/fee-records',
      '/fyp-proposal', '/student-transcript', '/student-notifications',
      '/student-profile'
    ],
    'clerk-header': [
      '/clerk-dashboard', '/single-enrollment', '/bulk-enrollment',
      '/fee-collection', '/student-records', '/generate-challan',
      '/fee-collection-reports', '/student-reports', '/clerk-profile'
    ],
    'faculty-header': [
      '/faculty-dashboard', '/faculty-profile', '/project-evaluation'
    ]
  };
  
  // Find which group contains this URL
  for (const [layout, routes] of Object.entries(layoutGroups)) {
    if (routes.some(route => url.startsWith(route))) {
      this.currentLayout = layout;
      return;
    }
  }
  
  this.currentLayout = 'visitor';
}
}