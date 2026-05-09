import { Component, HostListener, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, UserData } from '../../../core/services/auth-services/auth.service';
import { NotificationService, NotificationItem } from '../../../core/services/notification-servces/notification.service';

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
  
  user: UserData | null = null;
  notifications: NotificationItem[] = [];
  isLoadingNotifications = false;

  navItems = [
    { path: '/student-dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/semester-details', label: 'Semester Details', icon: 'fas fa-book-open' },
    { path: '/fee-records', label: 'Fee Records', icon: 'fas fa-credit-card' },
    { path: '/student-transcript', label: 'Transcript', icon: 'fas fa-file-pdf' },
    { path: '/fyp-proposal', label: 'FYP Proposal', icon: 'fas fa-project-diagram' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user = this.authService.getStoredUser();
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoadingNotifications = true;
    // ✅ Sirf unread
    this.notificationService.getMyNotifications().subscribe({
      next: (res) => {
        this.notifications = res.data;
        this.isLoadingNotifications = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingNotifications = false;
        this.cdr.detectChanges();
      }
    });
  }

  getInitials(): string {
    if (!this.user?.fullName) return 'ST';
    const names = this.user.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return this.user.fullName.substring(0, 2).toUpperCase();
  }

  get unreadCount(): number {
    return this.notifications.length;
  }

  getNotificationIcon(type: string, announcementType?: string | null): string {
    if (type === 'Announcement' && announcementType) {
      switch(announcementType) {
        case 'Urgent': return 'fas fa-exclamation-triangle';
        case 'Event': return 'fas fa-calendar-alt';
        case 'Information': return 'fas fa-info-circle';
        case 'Deadline': return 'fas fa-hourglass-half';
      }
    }
    switch(type) {
      case 'Fee': return 'fas fa-credit-card';
      case 'Exam': return 'fas fa-file-alt';
      case 'FYP': return 'fas fa-project-diagram';
      case 'Announcement': return 'fas fa-bullhorn';
      default: return 'fas fa-bell';
    }
  }

  getNotificationColor(type: string, announcementType?: string | null): string {
    if (type === 'Announcement' && announcementType) {
      switch(announcementType) {
        case 'Urgent': return 'bg-red-100 text-red-600';
        case 'Event': return 'bg-emerald-100 text-emerald-600';
        case 'Information': return 'bg-blue-100 text-blue-600';
        case 'Deadline': return 'bg-amber-100 text-amber-600';
      }
    }
    switch(type) {
      case 'Fee': return 'bg-emerald-100 text-emerald-600';
      case 'Exam': return 'bg-amber-100 text-amber-600';
      case 'FYP': return 'bg-purple-100 text-purple-600';
      case 'Announcement': return 'bg-blue-100 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  formatTimeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  markAsRead(notification: NotificationItem) {
    this.notificationService.markAsRead(notification.notificationId).subscribe({
      next: () => {
        // ✅ Dropdown se hatao
        this.notifications = this.notifications.filter(n => n.notificationId !== notification.notificationId);
        this.cdr.detectChanges();
      }
    });
    
    if (notification.actionUrl) {
      this.router.navigateByUrl(notification.actionUrl);
    }
    this.notificationsDropdownOpen = false;
  }

  clearAllNotifications() {
    this.notifications.forEach(n => {
      this.notificationService.markAsRead(n.notificationId).subscribe();
    });
    // ✅ Sab gayab
    this.notifications = [];
    this.notificationsDropdownOpen = false;
    this.cdr.detectChanges();
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
      this.loadNotifications();
    }
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (this.profileDropdownOpen && !target.closest('#profileMenuBtn') && !target.closest('#profileDropdown')) {
      this.profileDropdownOpen = false;
    }
    if (this.notificationsDropdownOpen && !target.closest('#notificationsBtn') && !target.closest('#notificationsDropdown')) {
      this.notificationsDropdownOpen = false;
    }
    this.cdr.detectChanges();
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.profileDropdownOpen = false;
    this.notificationsDropdownOpen = false;
    this.mobileMenuOpen = false;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 768) {
      this.mobileMenuOpen = false;
    }
  }
}