import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-services/auth.service';
import { UserData } from '../../../core/services/auth-services/auth.service';

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
  
  mobileEnrollmentOpen = false;
  mobileFeeOpen = false;
  mobileReportsOpen = false;
  
  user: UserData | null = null;

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
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getStoredUser();
  }

  getInitials(): string {
    if (!this.user?.fullName) return 'CK';
    const names = this.user.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return this.user.fullName.substring(0, 2).toUpperCase();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.profileDropdownOpen = false;
      this.notificationsDropdownOpen = false;
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
    if (this.mobileEnrollmentOpen) {
      this.mobileFeeOpen = false;
      this.mobileReportsOpen = false;
    }
  }

  toggleMobileFee() {
    this.mobileFeeOpen = !this.mobileFeeOpen;
    if (this.mobileFeeOpen) {
      this.mobileEnrollmentOpen = false;
      this.mobileReportsOpen = false;
    }
  }

  toggleMobileReports() {
    this.mobileReportsOpen = !this.mobileReportsOpen;
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

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) notification.isRead = true;
  }

  clearAllNotifications() {
    this.notifications = [];
    this.notificationsDropdownOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  getNotificationIconClass(type: string): string {
    switch(type) {
      case 'enrollment': return 'bg-emerald-100 text-emerald-600';
      case 'fee': return 'bg-amber-100 text-amber-600';
      case 'verification': return 'bg-blue-100 text-blue-600';
      default: return 'bg-purple-100 text-purple-600';
    }
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
    if (window.innerWidth >= 768) {
      this.mobileMenuOpen = false;
      this.mobileEnrollmentOpen = false;
      this.mobileFeeOpen = false;
      this.mobileReportsOpen = false;
    }
  }
}