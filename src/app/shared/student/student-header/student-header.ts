import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-student-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './student-header.html',
  styleUrl: './student-header.css',
})


export class StudentHeader implements OnInit {
  mobileMenuOpen = false;
  profileDropdownOpen = false;
  notificationsDropdownOpen = false;
  studentName = 'Ahmed Sheikh';
  studentRollNo = 'CS-2024-001';
  private isBrowser: boolean;

  notifications = [
    {
      id: '1',
      title: 'Fee Deadline Reminder',
      message: 'Last date to submit semester fee is May 15, 2026',
      time: '2 hours ago',
      type: 'warning',
      isRead: false,
      icon: 'fas fa-credit-card'
    },
    {
      id: '2',
      title: 'Exam Schedule Released',
      message: 'Final term exam schedule has been published',
      time: '1 day ago',
      type: 'info',
      isRead: false,
      icon: 'fas fa-calendar-alt'
    },
    {
      id: '3',
      title: 'FYP Proposal Deadline',
      message: 'Submit your FYP proposal before April 30, 2026',
      time: '3 days ago',
      type: 'deadline',
      isRead: true,
      icon: 'fas fa-project-diagram'
    }
  ];

  navItems = [
    { path: '/student-dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/semester-details', label: 'Semester Details', icon: 'fas fa-book-open' },
    { path: '/fee-records', label: 'Fee Records', icon: 'fas fa-credit-card' },
    { path: '/student-transcript', label: 'Transcript', icon: 'fas fa-file-pdf' },
    { path: '/fyp-proposal', label: 'FYP Proposal', icon: 'fas fa-project-diagram' },
    { path: '/student-notifications', label: 'Notifications', icon: 'fas fa-bell' }
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const savedName = localStorage.getItem('studentName');
      const savedRollNo = localStorage.getItem('studentRollNo');
      if (savedName) this.studentName = savedName;
      if (savedRollNo) this.studentRollNo = savedRollNo;
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
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  toggleProfileDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
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
    if (event) {
      event.stopPropagation();
    }
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
    if (notification) {
      notification.isRead = true;
    }
  }

  clearAllNotifications() {
    this.notifications = [];
    this.showToast('info', 'All notifications cleared');
    this.notificationsDropdownOpen = false;
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      if (this.isBrowser) {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentName');
        localStorage.removeItem('studentRollNo');
      }
      this.router.navigate(['/login']);
      this.showToast('success', 'Logged out successfully');
    }
  }

  getInitials(): string {
    return this.studentName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getNotificationIconClass(type: string): string {
    switch(type) {
      case 'warning': return 'bg-amber-100 text-amber-600';
      case 'deadline': return 'bg-red-100 text-red-600';
      case 'info': return 'bg-blue-100 text-blue-600';
      default: return 'bg-emerald-100 text-emerald-600';
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
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span class="text-sm font-semibold">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
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
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser && window.innerWidth >= 768) {
      this.mobileMenuOpen = false;
    }
  }
}