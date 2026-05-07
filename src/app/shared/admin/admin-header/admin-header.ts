import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-services/auth.service';
import { UserData } from '../../../core/services/auth-services/auth.service';

@Component({
  selector: 'app-admin-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader implements OnInit {
  mobileMenuOpen = false;
  adminDropdownOpen = false;
  enrollmentDropdownOpen = false;
  mobileEnrollmentOpen = false;
  
  user: UserData | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getStoredUser();
  }

  getInitials(): string {
    if (!this.user?.fullName) return 'AD';
    const names = this.user.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return this.user.fullName.substring(0, 2).toUpperCase();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.adminDropdownOpen = false;
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  toggleAdminDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.adminDropdownOpen = !this.adminDropdownOpen;
    if (this.adminDropdownOpen) {
      this.mobileMenuOpen = false;
    }
  }

  closeAdminDropdown() {
    this.adminDropdownOpen = false;
  }

  toggleMobileEnrollment(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.mobileEnrollmentOpen = !this.mobileEnrollmentOpen;
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (this.adminDropdownOpen && !target.closest('#adminMenuBtn') && !target.closest('#adminDropdown')) {
      this.adminDropdownOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.adminDropdownOpen = false;
    this.mobileMenuOpen = false;
    this.mobileEnrollmentOpen = false;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 768) {
      this.mobileMenuOpen = false;
      this.mobileEnrollmentOpen = false;
    }
  }
}