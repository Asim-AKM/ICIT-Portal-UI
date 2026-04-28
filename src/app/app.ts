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
    FacultyHeader
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
    
    // Login page (no header/footer)
    if (url === '/login') {
      this.currentLayout = 'none';
    }
    // Admin dashboard routes (fixed typo: 'admin-dashboard' not 'admin-dashbaord')
    else if (url.startsWith('/admin-dashboard')) {
      this.currentLayout = 'admin-header';
    }

     else if (url.startsWith('/users')) {
      this.currentLayout = 'admin-header';
    }

     else if (url.startsWith('/add-user')) {
      this.currentLayout = 'admin-header';
    }

     else if (url.startsWith('/admin-profile')) {
      this.currentLayout = 'admin-header';
    }
       else if (url.startsWith('/announcement')) {
      this.currentLayout = 'admin-header';
    }

     else if (url.startsWith('/bulk-student-verification')) {
      this.currentLayout = 'admin-header';
    }

    else if (url.startsWith('/student-verification')) {
      this.currentLayout = 'admin-header';
    }

    else if (url.startsWith('/session-details')) {
      this.currentLayout = 'admin-header';
    }

    
    else if (url.startsWith('/add-sessions')) {
      this.currentLayout = 'admin-header';
    }

     else if (url.startsWith('/student-dashboard')) {
      this.currentLayout = 'student-header';
    }

      else if (url.startsWith('/semester-details')) {
      this.currentLayout = 'student-header';
    }

     else if (url.startsWith('/fee-records')) {
      this.currentLayout = 'student-header';
    }

     else if (url.startsWith('/fyp-proposal')) {
      this.currentLayout = 'student-header';
    }
     else if (url.startsWith('/student-transcript')) {
      this.currentLayout = 'student-header';
    }

      else if (url.startsWith('/student-notifications')) {
      this.currentLayout = 'student-header';
    }
       else if (url.startsWith('/student-profile')) {
      this.currentLayout = 'student-header';
    }

       else if (url.startsWith('/clerk-dashboard')) {
      this.currentLayout = 'clerk-header';
    }

        else if (url.startsWith('/single-enrollment')) {
      this.currentLayout = 'clerk-header';
    }

      else if (url.startsWith('/bulk-enrollment')) {
      this.currentLayout = 'clerk-header';
    }

      else if (url.startsWith('/fee-collection')) {
      this.currentLayout = 'clerk-header';
    }


     else if (url.startsWith('/student-records')) {
      this.currentLayout = 'clerk-header';
    }

     else if (url.startsWith('/generate-challan')) {
      this.currentLayout = 'clerk-header';
    }
    else if (url.startsWith('/fee-collection-reports')) {
      this.currentLayout = 'clerk-header';
    }

     else if (url.startsWith('/student-reports')) {
      this.currentLayout = 'clerk-header';
    }


       else if (url.startsWith('/clerk-profile')) {
      this.currentLayout = 'clerk-header';
    }

      else if (url.startsWith('/faculty-dashboard')) {
      this.currentLayout = 'faculty-header';
    }

      else if (url.startsWith('/faculty-profile')) {
      this.currentLayout = 'faculty-header';
    }

     else if (url.startsWith('/project-evaluation')) {
      this.currentLayout = 'faculty-header';
    }
    // Default visitor layout (for home page, about, contact, etc.)
    else {
      this.currentLayout = 'visitor';
    }
  }
}