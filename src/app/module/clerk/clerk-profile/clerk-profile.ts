import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Activity {
  id: string;
  action: string;
  description: string;
  timestamp: Date;
  ipAddress: string;
  device: string;
  location: string;
}

@Component({
  selector: 'app-clerk-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clerk-profile.html',
  styleUrls: ['./clerk-profile.css']
})
export class ClerkProfile implements OnInit {
  private isBrowser: boolean;
  
  // Clerk Information
  clerkName = 'Fatima Ahmed';
  clerkId = 'CLK-2024-001';
  clerkEmail = 'fatima.ahmed@icit.edu.pk';
  clerkPhone = '+92-300-1234567';
  clerkDepartment = 'Admissions Office';
  clerkDesignation = 'Senior Admission Clerk';
  clerkJoiningDate = new Date('2022-01-15');
  clerkEmployeeId = 'EMP-2022-042';
  clerkAddress = 'House #123, Street 5, Gulshan-e-Iqbal, Karachi';
  clerkCity = 'Karachi';
  clerkPostalCode = '75300';
  
  profileImage: string | null = null;
  profileInitials = 'FA';
  isEditing = false;
  showChangePassword = false;
  
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // Statistics
  totalEnrollments = 1245;
  totalFeeCollected = 21500000;
  totalDocumentsVerified = 3420;
  workingDays = 245;
  
  // Recent Activities
  activities: Activity[] = [
    {
      id: '1',
      action: 'Bulk Enrollment Upload',
      description: 'Uploaded 45 students via Excel for Fall 2024 semester',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '2',
      action: 'Fee Collection',
      description: 'Processed fee payment of PKR 525,000 from 10 students',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '3',
      action: 'Documents Verified',
      description: 'Verified documents of 25 new students',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.5',
      device: 'Firefox on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '4',
      action: 'Profile Information Updated',
      description: 'Updated contact information',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '5',
      action: 'Login from New Device',
      description: 'Logged in from a new browser',
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      device: 'Safari on Mac',
      location: 'Lahore, Pakistan'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadProfile();
    this.generateInitials();
  }

  loadProfile() {
    if (this.isBrowser) {
      const savedImage = localStorage.getItem('clerkProfileImage');
      if (savedImage) {
        this.profileImage = savedImage;
      }
      
      const savedName = localStorage.getItem('clerkName');
      if (savedName) this.clerkName = savedName;
    }
  }

  generateInitials() {
    this.profileInitials = this.clerkName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
        if (this.isBrowser) {
          localStorage.setItem('clerkProfileImage', this.profileImage);
        }
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
      if (this.isBrowser) {
        localStorage.removeItem('clerkProfileImage');
      }
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
    if (this.isBrowser) {
      localStorage.setItem('clerkName', this.clerkName);
      localStorage.setItem('clerkEmail', this.clerkEmail);
      localStorage.setItem('clerkPhone', this.clerkPhone);
    }
    this.generateInitials();
    this.showToast('success', 'Profile updated successfully!');
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadProfile();
    this.generateInitials();
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

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  getActivityIcon(action: string): string {
    if (action.includes('Enrollment')) return 'fas fa-user-graduate';
    if (action.includes('Fee')) return 'fas fa-credit-card';
    if (action.includes('Documents')) return 'fas fa-file-alt';
    if (action.includes('Profile')) return 'fas fa-user-edit';
    if (action.includes('Login')) return 'fas fa-sign-in-alt';
    return 'fas fa-info-circle';
  }

  getActivityColor(action: string): string {
    if (action.includes('Enrollment')) return 'bg-emerald-100 text-emerald-600';
    if (action.includes('Fee')) return 'bg-blue-100 text-blue-600';
    if (action.includes('Documents')) return 'bg-purple-100 text-purple-600';
    if (action.includes('Profile')) return 'bg-amber-100 text-amber-600';
    if (action.includes('Login')) return 'bg-red-100 text-red-600';
    return 'bg-slate-100 text-slate-600';
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
}