import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  session: string;
  status: 'unverified' | 'verified' | 'rejected';
  cnic: string;
  fatherName: string;
  program: string;
  semester: number;
  registrationDate: Date;
  documents: {
    cnicCopy: boolean;
    domicile: boolean;
    previousDegree: boolean;
    feeChallan: boolean;
  };
}

@Component({
  selector: 'app-student-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-varification.html',
  styleUrl: './student-varification.css',
})
export class StudentVerification implements OnInit {
  // Add this line to expose Math to template
  Math = Math;
  
  selectedSession: string = 'spring-2026';
  selectedStatus: string = 'unverified';
  selectedStudent: Student | null = null;
  showDetailsModal: boolean = false;
  
  sessions = [
    { id: 'spring-2026', name: 'Spring Semester 2026', active: true },
    { id: 'fall-2025', name: 'Fall Semester 2025', active: false },
    { id: 'spring-2025', name: 'Spring Semester 2025', active: false }
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
        rollNumber: 'CS-2024-001',
        email: 'ahmed.sheikh@icit.edu',
        department: 'Computer Science',
        session: 'spring-2026',
        status: 'verified',
        cnic: '42101-1234567-8',
        fatherName: 'Mohammad Sheikh',
        program: 'BS Computer Science',
        semester: 4,
        registrationDate: new Date('2024-01-15'),
        documents: {
          cnicCopy: true,
          domicile: true,
          previousDegree: true,
          feeChallan: true
        }
      },
      {
        id: '2',
        name: 'Kashif Farooq',
        rollNumber: 'CS-2024-002',
        email: 'kashif.farooq@icit.edu',
        department: 'Computer Science',
        session: 'spring-2026',
        status: 'unverified',
        cnic: '42101-7654321-8',
        fatherName: 'Farooq Ahmed',
        program: 'BS Computer Science',
        semester: 4,
        registrationDate: new Date('2024-01-16'),
        documents: {
          cnicCopy: true,
          domicile: false,
          previousDegree: true,
          feeChallan: true
        }
      },
      {
        id: '3',
        name: 'Zain Ali',
        rollNumber: 'SE-2024-015',
        email: 'zain.ali@icit.edu',
        department: 'Software Engineering',
        session: 'spring-2026',
        status: 'rejected',
        cnic: '42101-9876543-8',
        fatherName: 'Ali Raza',
        program: 'BS Software Engineering',
        semester: 4,
        registrationDate: new Date('2024-01-14'),
        documents: {
          cnicCopy: true,
          domicile: false,
          previousDegree: false,
          feeChallan: true
        }
      },
      {
        id: '4',
        name: 'Fatima Zahra',
        rollNumber: 'CS-2024-008',
        email: 'fatima.zahra@icit.edu',
        department: 'Computer Science',
        session: 'spring-2026',
        status: 'unverified',
        cnic: '42101-4567890-8',
        fatherName: 'Hassan Ahmed',
        program: 'BS Computer Science',
        semester: 4,
        registrationDate: new Date('2024-01-17'),
        documents: {
          cnicCopy: true,
          domicile: true,
          previousDegree: true,
          feeChallan: false
        }
      },
      {
        id: '5',
        name: 'Omar Riaz',
        rollNumber: 'SE-2024-023',
        email: 'omar.riaz@icit.edu',
        department: 'Software Engineering',
        session: 'spring-2026',
        status: 'verified',
        cnic: '42101-3456789-8',
        fatherName: 'Riaz Ahmed',
        program: 'BS Software Engineering',
        semester: 4,
        registrationDate: new Date('2024-01-15'),
        documents: {
          cnicCopy: true,
          domicile: true,
          previousDegree: true,
          feeChallan: true
        }
      }
    ];
  }

  get filteredStudents(): Student[] {
    let filtered = this.students.filter(s => s.session === this.selectedSession);
    
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === this.selectedStatus);
    }
    
    return filtered;
  }

  getStatusCount(status: string): number {
    return this.students.filter(s => s.session === this.selectedSession && s.status === status).length;
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
  }

  verifyStudent(studentId: string) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      this.selectedStudent = student;
      this.showDetailsModal = true;
    }
  }

  confirmVerification() {
    if (this.selectedStudent) {
      this.selectedStudent.status = 'verified';
      this.showDetailsModal = false;
      this.selectedStudent = null;
      this.showToast('success', 'Student verified successfully!');
    }
  }

  rejectStudent(studentId: string) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      this.selectedStudent = student;
      this.showDetailsModal = true;
    }
  }

  confirmRejection() {
    if (this.selectedStudent) {
      this.selectedStudent.status = 'rejected';
      this.showDetailsModal = false;
      this.selectedStudent = null;
      this.showToast('error', 'Student application rejected!');
    }
  }

  reviewStudent(studentId: string) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      this.selectedStudent = student;
      this.showDetailsModal = true;
    }
  }

  closeModal() {
    this.showDetailsModal = false;
    this.selectedStudent = null;
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'verified': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'unverified': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
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

  getDocumentStatusIcon(isValid: boolean): string {
    return isValid ? 'fas fa-check-circle text-emerald-500' : 'fas fa-times-circle text-red-500';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
}