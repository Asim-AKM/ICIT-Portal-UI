import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  department: string;
  employeeId: string;
  joinDate: Date;
  twoFactorEnabled: boolean;
  bio: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
  };
}

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css',
})
export class AdminProfile implements OnInit {
  Math = Math;
  
  profile: ProfileData = {
    fullName: 'Dr. Sarah Ahmed',
    email: 'sarah.ahmed@icit.edu.pk',
    phoneNumber: '+92-300-1234567',
    designation: 'Senior System Administrator',
    department: 'IT Administration',
    employeeId: 'AD-2026-001',
    joinDate: new Date('2022-01-15'),
    twoFactorEnabled: true,
    bio: 'Experienced system administrator with 8+ years in educational technology. Passionate about cybersecurity and cloud infrastructure.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahahmed',
      github: 'https://github.com/sarahahmed',
      twitter: 'https://twitter.com/sarahahmed'
    }
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  showChangePassword: boolean = false;
  isEditing: boolean = false;
  profileImage: string | null = null;
  profileInitials: string = 'SA';
  activeTab: string = 'overview';
  
  stats = {
    totalLogins: 847,
    lastLoginDays: 2,
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
    this.generateInitials();
  }

  loadProfile() {
    const savedImage = localStorage.getItem('adminProfileImage');
    if (savedImage) {
      this.profileImage = savedImage;
    }
  }

  generateInitials() {
    const names = this.profile.fullName.split(' ');
    if (names.length >= 2) {
      this.profileInitials = (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    } else {
      this.profileInitials = this.profile.fullName.substring(0, 2).toUpperCase();
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
        localStorage.setItem('adminProfileImage', this.profileImage);
        this.showToast('success', 'Profile picture updated!');
      };
      
      reader.readAsDataURL(file);
    }
  }

  triggerImageUpload() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  removeImage() {
    if (confirm('Are you sure you want to remove your profile picture?')) {
      this.profileImage = null;
      localStorage.removeItem('adminProfileImage');
      this.showToast('success', 'Profile picture removed');
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.saveProfile();
    }
  }

  saveProfile() {
    this.generateInitials();
    this.showToast('success', 'Profile updated successfully!');
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadProfile();
  }

  toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
    if (!this.showChangePassword) {
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  }

  changePassword() {
    if (!this.passwordData.currentPassword) {
      this.showToast('error', 'Please enter current password');
      return;
    }
    
    if (this.passwordData.newPassword.length < 8) {
      this.showToast('error', 'New password must be at least 8 characters');
      return;
    }
    
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.showToast('error', 'New passwords do not match');
      return;
    }
    
    this.showToast('success', 'Password changed successfully!');
    this.showChangePassword = false;
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  toggle2FA() {
    this.profile.twoFactorEnabled = !this.profile.twoFactorEnabled;
    this.showToast('success', `2FA ${this.profile.twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`);
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  showToast(type: string, message: string) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-slide-up ${
      type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span class="text-sm font-semibold">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
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

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}