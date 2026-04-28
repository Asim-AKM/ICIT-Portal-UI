import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-faculty-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './faculty-header.html',
  styleUrl: './faculty-header.css'
})
export class FacultyHeader implements OnInit {
  mobileMenuOpen = false;
  profileDropdownOpen = false;
  notificationsDropdownOpen = false;
  
  // Mobile dropdown states
  mobileCoursesOpen = false;
  mobileEvaluationOpen = false;
  
  facultyName = 'Dr. Sarah Ahmed';
  facultyId = 'FAC-2024-001';
  facultyDepartment = 'Computer Science';
  private isBrowser: boolean;

  notifications = [
    {
      id: '1',
      title: 'New Course Material Request',
      message: 'Students requested additional resources for Web Development course',
      time: '2 hours ago',
      type: 'course',
      isRead: false,
      icon: 'fas fa-book'
    },
    {
      id: '2',
      title: 'Project Submission Deadline',
      message: 'FYP proposals deadline is approaching in 5 days',
      time: '1 day ago',
      type: 'project',
      isRead: false,
      icon: 'fas fa-project-diagram'
    },
    {
      id: '3',
      title: 'Student Feedback Pending',
      message: '12 students waiting for performance feedback',
      time: '2 days ago',
      type: 'feedback',
      isRead: true,
      icon: 'fas fa-comment-dots'
    }
  ];

  navItems = [
    { path: '/faculty-dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/faculty/courses', label: 'My Courses', icon: 'fas fa-book-open' },
    { path: '/faculty/materials', label: 'Course Materials', icon: 'fas fa-file-alt' },
    { path: '/project-evaluation', label: 'Project Evaluation', icon: 'fas fa-project-diagram' },
    { path: '/faculty/feedback', label: 'Student Feedback', icon: 'fas fa-comment-dots' },
    { path: '/faculty/teaching-history', label: 'Teaching History', icon: 'fas fa-history' }
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const savedName = localStorage.getItem('facultyName');
      if (savedName) this.facultyName = savedName;
    }
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.profileDropdownOpen = false;
      this.notificationsDropdownOpen = false;
      this.mobileCoursesOpen = false;
      this.mobileEvaluationOpen = false;
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.mobileCoursesOpen = false;
    this.mobileEvaluationOpen = false;
  }

  toggleMobileCourses() {
    this.mobileCoursesOpen = !this.mobileCoursesOpen;
    if (this.mobileCoursesOpen) {
      this.mobileEvaluationOpen = false;
    }
  }

  toggleMobileEvaluation() {
    this.mobileEvaluationOpen = !this.mobileEvaluationOpen;
    if (this.mobileEvaluationOpen) {
      this.mobileCoursesOpen = false;
    }
  }

  toggleProfileDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.profileDropdownOpen = !this.profileDropdownOpen;
    if (this.profileDropdownOpen) {
      this.notificationsDropdownOpen = false;
      this.mobileMenuOpen = false;
    }
  }

  closeProfileDropdown() {
    this.profileDropdownOpen = false;
  }

  toggleNotificationsDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.notificationsDropdownOpen = !this.notificationsDropdownOpen;
    if (this.notificationsDropdownOpen) {
      this.profileDropdownOpen = false;
      this.mobileMenuOpen = false;
    }
  }

  closeNotificationsDropdown() {
    this.notificationsDropdownOpen = false;
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) notification.isRead = true;
  }

  clearAllNotifications() {
    this.notifications = [];
    this.showToast('info', 'All notifications cleared');
    this.notificationsDropdownOpen = false;
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      if (this.isBrowser) {
        localStorage.removeItem('facultyToken');
        localStorage.removeItem('facultyName');
      }
      this.router.navigate(['/login']);
      this.showToast('success', 'Logged out successfully');
    }
  }

  getInitials(): string {
    return this.facultyName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getNotificationIconClass(type: string): string {
    switch(type) {
      case 'course': return 'bg-emerald-100 text-emerald-600';
      case 'project': return 'bg-purple-100 text-purple-600';
      case 'feedback': return 'bg-blue-100 text-blue-600';
      default: return 'bg-amber-100 text-amber-600';
    }
  }

  showToast(type: string, message: string) {
    if (!this.isBrowser) return;
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-slide-up ${
      type === 'success' ? 'bg-emerald-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`;
    toast.innerHTML = `<div class="flex items-center gap-2"><i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i><span class="text-sm font-semibold">${message}</span></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isBrowser) return;
    const target = event.target as HTMLElement;
    if (this.profileDropdownOpen && !target.closest('#profileMenuBtn') && !target.closest('#profileDropdown')) {
      this.profileDropdownOpen = false;
    }
    if (this.notificationsDropdownOpen && !target.closest('#notificationsBtn') && !target.closest('#notificationsDropdown')) {
      this.notificationsDropdownOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.profileDropdownOpen = false;
    this.notificationsDropdownOpen = false;
    this.mobileMenuOpen = false;
    this.mobileCoursesOpen = false;
    this.mobileEvaluationOpen = false;
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser && window.innerWidth >= 768) {
      this.mobileMenuOpen = false;
      this.mobileCoursesOpen = false;
      this.mobileEvaluationOpen = false;
    }
  }
}