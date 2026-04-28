import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  program: string;
  semester: number;
  status: 'verified' | 'unverified' | 'rejected';
  registrationDate: Date;
  cnic: string;
  fatherName: string;
  contactNumber: string;
}

interface Session {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-session-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-details.html',
  styleUrl: './session-details.css',
})
export class SessionDetails implements OnInit {
  Math = Math;
  
  selectedSession: string = 'spring-2026';
  selectedStatus: string = 'verified';
  
  sessions: Session[] = [
    { id: 'spring-2026', name: 'Spring Semester', year: 2026, isActive: true, startDate: new Date('2026-01-15'), endDate: new Date('2026-05-30') },
    { id: 'fall-2025', name: 'Fall Semester', year: 2025, isActive: false, startDate: new Date('2025-09-01'), endDate: new Date('2025-12-20') },
    { id: 'winter-2025', name: 'Winter Term', year: 2025, isActive: false, startDate: new Date('2025-01-10'), endDate: new Date('2025-03-25') }
  ];

  students: Student[] = [];

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    // Mock data - replace with API call
    this.students = [
      {
        id: '1',
        name: 'Ahmed Sheikh',
        rollNumber: 'STU-2026-001',
        email: 'ahmed.sheikh@icit.edu',
        department: 'Computer Science',
        program: 'BS Computer Science',
        semester: 4,
        status: 'verified',
        registrationDate: new Date('2026-01-15'),
        cnic: '42101-1234567-8',
        fatherName: 'Mohammad Sheikh',
        contactNumber: '+92-300-1234567'
      },
      {
        id: '2',
        name: 'Kashif Farooq',
        rollNumber: 'STU-2026-042',
        email: 'kashif.farooq@icit.edu',
        department: 'Computer Science',
        program: 'BS Computer Science',
        semester: 4,
        status: 'unverified',
        registrationDate: new Date('2026-01-16'),
        cnic: '42101-7654321-8',
        fatherName: 'Farooq Ahmed',
        contactNumber: '+92-300-7654321'
      },
      {
        id: '3',
        name: 'Zain Ali',
        rollNumber: 'STU-2026-089',
        email: 'zain.ali@icit.edu',
        department: 'Software Engineering',
        program: 'BS Software Engineering',
        semester: 4,
        status: 'rejected',
        registrationDate: new Date('2026-01-14'),
        cnic: '42101-9876543-8',
        fatherName: 'Ali Raza',
        contactNumber: '+92-300-9876543'
      },
      {
        id: '4',
        name: 'Fatima Zahra',
        rollNumber: 'STU-2026-015',
        email: 'fatima.zahra@icit.edu',
        department: 'Computer Science',
        program: 'BS Computer Science',
        semester: 4,
        status: 'verified',
        registrationDate: new Date('2026-01-17'),
        cnic: '42101-4567890-8',
        fatherName: 'Hassan Ahmed',
        contactNumber: '+92-300-4567890'
      },
      {
        id: '5',
        name: 'Omar Riaz',
        rollNumber: 'STU-2026-023',
        email: 'omar.riaz@icit.edu',
        department: 'Software Engineering',
        program: 'BS Software Engineering',
        semester: 4,
        status: 'unverified',
        registrationDate: new Date('2026-01-15'),
        cnic: '42101-3456789-8',
        fatherName: 'Riaz Ahmed',
        contactNumber: '+92-300-3456789'
      },
      {
        id: '6',
        name: 'Sara Khan',
        rollNumber: 'STU-2026-067',
        email: 'sara.khan@icit.edu',
        department: 'Information Technology',
        program: 'BS IT',
        semester: 4,
        status: 'verified',
        registrationDate: new Date('2026-01-13'),
        cnic: '42101-2345678-9',
        fatherName: 'Khan Muhammad',
        contactNumber: '+92-300-2345678'
      }
    ];
  }

  get filteredStudents(): Student[] {
    let filtered = this.students;
    
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === this.selectedStatus);
    }
    
    return filtered;
  }

  getStatusCount(status: string): number {
    return this.students.filter(s => s.status === status).length;
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'verified': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'unverified': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'verified': return 'fas fa-check-circle';
      case 'unverified': return 'fas fa-clock';
      case 'rejected': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  }

  getStatusDotColor(status: string): string {
    switch(status) {
      case 'verified': return 'bg-emerald-500';
      case 'unverified': return 'bg-amber-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getAvatarColor(status: string): string {
    switch(status) {
      case 'verified': return 'bg-emerald-100 text-emerald-700';
      case 'unverified': return 'bg-amber-100 text-amber-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
  }

  verifyStudent(studentId: string) {
    const student = this.students.find(s => s.id === studentId);
    if (student && student.status === 'unverified') {
      student.status = 'verified';
      this.showToast('success', `${student.name} has been verified successfully!`);
    }
  }

  rejectStudent(studentId: string) {
    const student = this.students.find(s => s.id === studentId);
    if (student && student.status === 'unverified') {
      if (confirm(`Are you sure you want to reject ${student.name}'s application?`)) {
        student.status = 'rejected';
        this.showToast('error', `${student.name}'s application has been rejected.`);
      }
    }
  }

  reevaluateStudent(studentId: string) {
    const student = this.students.find(s => s.id === studentId);
    if (student && student.status === 'rejected') {
      if (confirm(`Re-evaluate ${student.name}'s application?`)) {
        student.status = 'unverified';
        this.showToast('info', `${student.name}'s application is now pending review.`);
      }
    }
  }

  editStudent(studentId: string) {
    console.log('Edit student:', studentId);
    this.showToast('info', 'Edit functionality coming soon!');
  }

  getSessionName(): string {
    const session = this.sessions.find(s => s.id === this.selectedSession);
    return session ? `${session.name} ${session.year}` : '';
  }

  getSessionDates(): string {
    const session = this.sessions.find(s => s.id === this.selectedSession);
    if (session) {
      return `${session.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${session.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return '';
  }

  showToast(type: string, message: string) {
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