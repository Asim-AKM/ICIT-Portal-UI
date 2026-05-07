import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService, UserProfile } from '../../core/services/account-services/profile.service';
import { ToastService } from '../../core/services/toast-service/toast.service';

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: Date;
  ipAddress: string;
  icon: string;
  iconColor: string;
  device: string;
  location: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  Math = Math;
  
  private profileService = inject(ProfileService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  
  profile: UserProfile = {
    userId: '',
    fullName: '',
    userName: '',
    email: '',
    contact: '',
    cnic: '',
    createdAt: '',
    role: '',
    department: '',
    imageUrl: ''
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  showChangePassword: boolean = false;
  isEditing: boolean = false;
  profileImage: string | null = null;
  profileInitials: string = '';
  activeTab: string = 'overview';
  isLoading: boolean = false;
  isUploading: boolean = false;
  
  stats = {
    totalLogins: 847,
    securityScore: 92,
    devicesActive: 3
  };

  activities: ActivityItem[] = [
    {
      id: '1',
      action: 'Password changed successfully',
      description: 'Security credentials updated',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      icon: 'fas fa-key',
      iconColor: 'emerald',
      device: 'Chrome on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '2',
      action: 'Exported Audit Logs',
      description: 'April 2026 system logs exported',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      icon: 'fas fa-file-export',
      iconColor: 'blue',
      device: 'Firefox on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '3',
      action: 'Profile Information Updated',
      description: 'Contact information changed',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.5',
      icon: 'fas fa-user-edit',
      iconColor: 'purple',
      device: 'Edge on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '4',
      action: 'Login from New Device',
      description: 'New browser detected',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      icon: 'fas fa-laptop',
      iconColor: 'amber',
      device: 'Safari on Mac',
      location: 'Lahore, Pakistan'
    }
  ];

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data;
        if (this.profile.imageUrl) {
          this.profileImage = this.profile.imageUrl;
        }
        this.generateInitials();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load profile');
      }
    });
  }

  generateInitials() {
    if (this.profile.fullName) {
      const names = this.profile.fullName.split(' ');
      if (names.length >= 2) {
        this.profileInitials = (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
      } else {
        this.profileInitials = this.profile.fullName.substring(0, 2).toUpperCase();
      }
    }
    this.cdr.detectChanges();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.toast.error('Only JPG, PNG, and WebP images are allowed');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('Image size must be less than 5MB');
        return;
      }
      
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    this.isUploading = true;
    this.cdr.detectChanges();
    
    this.profileService.uploadProfileImage(this.profile.userId, file).subscribe({
      next: (res) => {
        this.profileImage = res.data;
        this.profile.imageUrl = res.data;
        this.isUploading = false;
        this.cdr.detectChanges();
        this.toast.success('Profile picture updated!');
      },
      error: (err) => {
        this.isUploading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to upload image');
      }
    });
  }

  triggerImageUpload() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  removeImage() {
    this.profileService.removeProfileImage(this.profile.userId).subscribe({
      next: () => {
        this.profileImage = null;
        this.profile.imageUrl = '';
        this.cdr.detectChanges();
        this.toast.success('Profile picture removed');
      },
      error: () => {
        this.toast.error('Failed to remove image');
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.cdr.detectChanges();
  }

  saveProfile() {
    this.generateInitials();
    this.isEditing = false;
    this.cdr.detectChanges();
    this.toast.success('Profile updated successfully!');
  }

  cancelEdit() {
    this.isEditing = false;
    this.cdr.detectChanges();
    this.loadProfile();
  }

  toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
    if (!this.showChangePassword) {
      this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    }
    this.cdr.detectChanges();
  }

  changePassword() {
    if (!this.passwordData.currentPassword) {
      this.toast.error('Please enter current password');
      return;
    }
    if (this.passwordData.newPassword.length < 8) {
      this.toast.error('New password must be at least 8 characters');
      return;
    }
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toast.error('New passwords do not match');
      return;
    }
    this.toast.success('Password changed successfully!');
    this.showChangePassword = false;
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.cdr.detectChanges();
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  getActivityIconColor(color: string): string {
    switch(color) {
      case 'emerald': return 'bg-emerald-100 text-emerald-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'amber': return 'bg-amber-100 text-amber-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  }
}