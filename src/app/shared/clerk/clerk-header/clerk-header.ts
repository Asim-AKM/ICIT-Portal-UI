import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-clerk-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './clerk-header.html',
  styleUrl: './clerk-header.css'
})
export class ClerkHeader implements OnInit {
  mobileMenuOpen = false;
  profileDropdownOpen = false;
  notificationsDropdownOpen = false;
  
  // Mobile dropdown states
  mobileEnrollmentOpen = false;
  mobileFeeOpen = false;
  mobileReportsOpen = false;
  
  clerkName = 'Fatima Ahmed';
  clerkId = 'CLK-2024-001';
  private isBrowser: boolean;

  notifications = [
    {
      id: '1',
      title: 'New Enrollment Request',
      message: '5 students have submitted enrollment applications',
      time: '1 hour ago',
      type: 'enrollment',
      isRead: false,
      icon: 'fas fa-user-graduate'
    },
    {
      id: '2',
      title: 'Fee Collection Target',
      message: 'Monthly target: 85% completed',
      time: '3 hours ago',
      type: 'fee',
      isRead: false,
      icon: 'fas fa-credit-card'
    },
    {
      id: '3',
      title: 'Document Verification Pending',
      message: '12 documents awaiting verification',
      time: '1 day ago',
      type: 'verification',
      isRead: true,
      icon: 'fas fa-file-alt'
    }
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const savedName = localStorage.getItem('clerkName');
      if (savedName) this.clerkName = savedName;
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
      // Close mobile submenus when main menu closes
      this.mobileEnrollmentOpen = false;
      this.mobileFeeOpen = false;
      this.mobileReportsOpen = false;
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.mobileEnrollmentOpen = false;
    this.mobileFeeOpen = false;
    this.mobileReportsOpen = false;
  }

  toggleMobileEnrollment() {
    this.mobileEnrollmentOpen = !this.mobileEnrollmentOpen;
    // Close other dropdowns when opening this one
    if (this.mobileEnrollmentOpen) {
      this.mobileFeeOpen = false;
      this.mobileReportsOpen = false;
    }
  }

  toggleMobileFee() {
    this.mobileFeeOpen = !this.mobileFeeOpen;
    // Close other dropdowns when opening this one
    if (this.mobileFeeOpen) {
      this.mobileEnrollmentOpen = false;
      this.mobileReportsOpen = false;
    }
  }

  toggleMobileReports() {
    this.mobileReportsOpen = !this.mobileReportsOpen;
    // Close other dropdowns when opening this one
    if (this.mobileReportsOpen) {
      this.mobileEnrollmentOpen = false;
      this.mobileFeeOpen = false;
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
        localStorage.removeItem('clerkToken');
        localStorage.removeItem('clerkName');
      }
      this.router.navigate(['/login']);
      this.showToast('success', 'Logged out successfully');
    }
  }

  getInitials(): string {
    return this.clerkName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getNotificationIconClass(type: string): string {
    switch(type) {
      case 'enrollment': return 'bg-emerald-100 text-emerald-600';
      case 'fee': return 'bg-amber-100 text-amber-600';
      case 'verification': return 'bg-blue-100 text-blue-600';
      default: return 'bg-purple-100 text-purple-600';
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
    this.mobileEnrollmentOpen = false;
    this.mobileFeeOpen = false;
    this.mobileReportsOpen = false;
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser && window.innerWidth >= 768) {
      this.mobileMenuOpen = false;
      this.mobileEnrollmentOpen = false;
      this.mobileFeeOpen = false;
      this.mobileReportsOpen = false;
    }
  }
}