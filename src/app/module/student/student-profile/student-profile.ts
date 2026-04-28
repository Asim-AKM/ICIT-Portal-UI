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
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-profile.html',
  styleUrls: ['./student-profile.css']
})
export class StudentProfile implements OnInit {
  private isBrowser: boolean;
  
  // Profile Information
  studentName = 'Ahmed Sheikh';
  studentRollNo = 'CS-2024-001';
  studentEmail = 'ahmed.sheikh@icit.edu.pk';
  studentPhone = '+92-300-1234567';
  studentFatherName = 'Mohammad Sheikh';
  studentCNIC = '42101-1234567-8';
  studentDOB = '1998-05-15';
  studentGender = 'Male';
  studentBloodGroup = 'B+';
  studentAddress = 'House #123, Street 5, Gulshan-e-Iqbal, Karachi';
  studentDepartment = 'Computer Science';
  studentProgram = 'BS Computer Science';
  studentSession = 'Fall 2024';
  studentSemester = '4th Semester';
  studentCgpa = 3.75;
  
  profileImage: string | null = null;
  profileInitials = 'AS';
  isEditing = false;
  showChangePassword = false;
  
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  activities: Activity[] = [
    {
      id: '1',
      action: 'Profile Information Updated',
      description: 'Changed phone number and address',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '2',
      action: 'Password Changed',
      description: 'Account password was updated',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      device: 'Firefox on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '3',
      action: 'Login from New Device',
      description: 'Logged in from a new browser',
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.5',
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
      const savedImage = localStorage.getItem('studentProfileImage');
      if (savedImage) {
        this.profileImage = savedImage;
      }
      
      // Load saved profile data
      const savedName = localStorage.getItem('studentName');
      if (savedName) this.studentName = savedName;
    }
  }
  
  generateInitials() {
    this.profileInitials = this.studentName.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
        if (this.isBrowser) {
          localStorage.setItem('studentProfileImage', this.profileImage);
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
        localStorage.removeItem('studentProfileImage');
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
      localStorage.setItem('studentName', this.studentName);
      localStorage.setItem('studentEmail', this.studentEmail);
      localStorage.setItem('studentPhone', this.studentPhone);
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
    
    // Add API call to change password
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
    if (action.includes('Profile')) return 'fas fa-user-edit';
    if (action.includes('Password')) return 'fas fa-key';
    if (action.includes('Login')) return 'fas fa-sign-in-alt';
    return 'fas fa-info-circle';
  }
  
  getActivityColor(action: string): string {
    if (action.includes('Profile')) return 'bg-blue-100 text-blue-600';
    if (action.includes('Password')) return 'bg-amber-100 text-amber-600';
    if (action.includes('Login')) return 'bg-purple-100 text-purple-600';
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
}