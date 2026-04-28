import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface TeachingHistory {
  id: string;
  courseCode: string;
  courseName: string;
  semester: string;
  year: number;
  program: string;
  enrolledStudents: number;
  evaluation: number;
}

interface ResearchPublication {
  id: string;
  title: string;
  journal: string;
  year: number;
  citations: number;
}

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
  selector: 'app-faculty-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-profile.html',
  styleUrls: ['./faculty-profile.css']
})
export class FacultyProfile implements OnInit {
  private isBrowser: boolean;
  
  // Faculty Information
  facultyName = 'Dr. Sarah Ahmed';
  facultyId = 'FAC-2024-001';
  facultyEmail = 'sarah.ahmed@icit.edu.pk';
  facultyPhone = '+92-300-1234567';
  facultyDepartment = 'Computer Science';
  facultyDesignation = 'Professor';
  facultySpecialization = 'Web Development, Database Systems';
  facultyQualification = 'PhD Computer Science';
  facultyJoiningDate = new Date('2020-08-15');
  facultyEmployeeId = 'EMP-2020-042';
  facultyOfficeRoom = 'Room 201, Block A';
  facultyOfficeHours = 'Monday & Wednesday, 2:00 PM - 4:00 PM';
  facultyBio = 'Experienced computer science professor with over 10 years of teaching experience. Specialized in Web Development, Database Systems, and Software Engineering. Published research papers in international journals and conferences.';
  facultyAddress = 'House #45, Street 12, DHA Phase 8, Karachi';
  facultyCity = 'Karachi';
  
  profileImage: string | null = null;
  profileInitials = 'SA';
  isEditing = false;
  showChangePassword = false;
  
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // Statistics
  totalCourses = 12;
  totalStudents = 478;
  totalPublications = 8;
  totalCitations = 156;
  averageRating = 4.8;
  
  // Teaching History
  teachingHistory: TeachingHistory[] = [
    { id: '1', courseCode: 'CS401', courseName: 'Web Development', semester: 'Spring', year: 2026, program: 'BSCS', enrolledStudents: 45, evaluation: 4.9 },
    { id: '2', courseCode: 'CS402', courseName: 'Database Systems', semester: 'Spring', year: 2026, program: 'BSCS', enrolledStudents: 42, evaluation: 4.8 },
    { id: '3', courseCode: 'CS301', courseName: 'Object Oriented Programming', semester: 'Fall', year: 2025, program: 'BSCS', enrolledStudents: 48, evaluation: 4.7 },
    { id: '4', courseCode: 'CS302', courseName: 'Data Structures', semester: 'Fall', year: 2025, program: 'BSCS', enrolledStudents: 44, evaluation: 4.9 },
    { id: '5', courseCode: 'CS201', courseName: 'Programming Fundamentals', semester: 'Spring', year: 2025, program: 'BSCS', enrolledStudents: 52, evaluation: 4.8 }
  ];
  
  // Research Publications
  researchPublications: ResearchPublication[] = [
    { id: '1', title: 'AI-Powered Web Development Frameworks', journal: 'International Journal of Web Technology', year: 2025, citations: 45 },
    { id: '2', title: 'Database Optimization Techniques for Big Data', journal: 'Journal of Database Management', year: 2024, citations: 78 },
    { id: '3', title: 'Machine Learning in Software Engineering', journal: 'Software Engineering Journal', year: 2024, citations: 33 },
    { id: '4', title: 'Cloud Computing for Educational Institutions', journal: 'International Journal of Cloud Computing', year: 2023, citations: 52 }
  ];
  
  // Recent Activities
  activities: Activity[] = [
    {
      id: '1',
      action: 'Course Material Uploaded',
      description: 'Uploaded lecture slides for Web Development - Week 8',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '2',
      action: 'Student Feedback Submitted',
      description: 'Provided performance feedback for 25 students',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '3',
      action: 'Project Evaluated',
      description: 'Evaluated 5 FYP proposals',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.5',
      device: 'Firefox on Windows',
      location: 'Karachi, Pakistan'
    },
    {
      id: '4',
      action: 'Profile Information Updated',
      description: 'Updated research publications',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows',
      location: 'Karachi, Pakistan'
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
      const savedImage = localStorage.getItem('facultyProfileImage');
      if (savedImage) {
        this.profileImage = savedImage;
      }
      const savedName = localStorage.getItem('facultyName');
      if (savedName) this.facultyName = savedName;
    }
  }

  generateInitials() {
    this.profileInitials = this.facultyName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
        if (this.isBrowser) {
          localStorage.setItem('facultyProfileImage', this.profileImage);
        }
        this.showToast('success', 'Profile picture updated!');
      };
      
      reader.readAsDataURL(file);
    }
  }

  triggerImageUpload() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  removeImage() {
    if (confirm('Are you sure you want to remove your profile picture?')) {
      this.profileImage = null;
      if (this.isBrowser) {
        localStorage.removeItem('facultyProfileImage');
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
      localStorage.setItem('facultyName', this.facultyName);
      localStorage.setItem('facultyEmail', this.facultyEmail);
      localStorage.setItem('facultyPhone', this.facultyPhone);
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
    if (action.includes('Material')) return 'fas fa-file-alt';
    if (action.includes('Feedback')) return 'fas fa-comment-dots';
    if (action.includes('Project')) return 'fas fa-project-diagram';
    if (action.includes('Profile')) return 'fas fa-user-edit';
    return 'fas fa-info-circle';
  }

  getActivityColor(action: string): string {
    if (action.includes('Material')) return 'bg-emerald-100 text-emerald-600';
    if (action.includes('Feedback')) return 'bg-blue-100 text-blue-600';
    if (action.includes('Project')) return 'bg-purple-100 text-purple-600';
    if (action.includes('Profile')) return 'bg-amber-100 text-amber-600';
    return 'bg-slate-100 text-slate-600';
  }

  getStarRating(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars: string[] = [];
    for (let i = 0; i < fullStars; i++) stars.push('fas fa-star text-amber-400');
    if (hasHalfStar) stars.push('fas fa-star-half-alt text-amber-400');
    while (stars.length < 5) stars.push('far fa-star text-slate-300');
    return stars;
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