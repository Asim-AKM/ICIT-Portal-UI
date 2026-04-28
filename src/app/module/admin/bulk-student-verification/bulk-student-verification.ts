import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  status: 'unverified' | 'verified' | 'rejected';
  email: string;
  registrationDate: string;
}

@Component({
  selector: 'app-bulk-student-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-student-verification.html',
  styleUrl: './bulk-student-verification.css',
})
export class BulkStudentVerification implements OnInit {
  selectedSession = 'spring-2026';
  selectedStatus = 'unverified';
  students: Student[] = [];
  selectedStudents: Set<string> = new Set();
  showModal = false;
  modalAction: 'verify' | 'reject' = 'verify';
  modalStudentIds: string[] = [];

  sessions = [
    { id: 'spring-2026', name: 'Spring Semester 2026' },
    { id: 'fall-2025', name: 'Fall Semester 2025' },
    { id: 'spring-2025', name: 'Spring Semester 2025' }
  ];

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    // Mock data - replace with API call
    this.students = [
      {
        id: '1',
        name: 'Ahmed Sheikh',
        rollNumber: 'CS-2020-001',
        department: 'Computer Science',
        status: 'verified',
        email: 'ahmed.sheikh@icit.edu',
        registrationDate: '2025-01-15'
      },
      {
        id: '2',
        name: 'Kashif Farooq',
        rollNumber: 'CS-2020-002',
        department: 'Computer Science',
        status: 'unverified',
        email: 'kashif.farooq@icit.edu',
        registrationDate: '2025-01-16'
      },
      {
        id: '3',
        name: 'Zain Ali',
        rollNumber: 'SE-2020-015',
        department: 'Software Engineering',
        status: 'rejected',
        email: 'zain.ali@icit.edu',
        registrationDate: '2025-01-14'
      },
      {
        id: '4',
        name: 'Sara Khan',
        rollNumber: 'CS-2020-008',
        department: 'Computer Science',
        status: 'unverified',
        email: 'sara.khan@icit.edu',
        registrationDate: '2025-01-17'
      },
      {
        id: '5',
        name: 'Omar Riaz',
        rollNumber: 'SE-2020-023',
        department: 'Software Engineering',
        status: 'unverified',
        email: 'omar.riaz@icit.edu',
        registrationDate: '2025-01-15'
      }
    ];
  }

  get filteredStudents(): Student[] {
    return this.students.filter(student => student.status === this.selectedStatus);
  }

  get selectedCount(): number {
    return this.selectedStudents.size;
  }

  get isAllSelected(): boolean {
    const filtered = this.filteredStudents;
    return filtered.length > 0 && filtered.every(s => this.selectedStudents.has(s.id));
  }

  toggleSelectAll() {
    if (this.isAllSelected) {
      this.filteredStudents.forEach(s => this.selectedStudents.delete(s.id));
    } else {
      this.filteredStudents.forEach(s => this.selectedStudents.add(s.id));
    }
    // Trigger change detection
    this.selectedStudents = new Set(this.selectedStudents);
  }

  toggleStudent(id: string) {
    if (this.selectedStudents.has(id)) {
      this.selectedStudents.delete(id);
    } else {
      this.selectedStudents.add(id);
    }
    this.selectedStudents = new Set(this.selectedStudents);
  }

  filterByStatus(status: 'unverified' | 'verified' | 'rejected') {
    this.selectedStatus = status;
    this.selectedStudents.clear();
    this.selectedStudents = new Set();
  }

  openModal(action: 'verify' | 'reject', studentIds: string | string[]) {
    this.modalAction = action;
    this.modalStudentIds = Array.isArray(studentIds) ? studentIds : [studentIds];
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalStudentIds = [];
  }

  executeAction() {
    if (this.modalAction === 'verify') {
      this.modalStudentIds.forEach(id => {
        const student = this.students.find(s => s.id === id);
        if (student) {
          student.status = 'verified';
        }
      });
      this.showToast('success', `${this.modalStudentIds.length} student(s) verified successfully!`);
    } else {
      this.modalStudentIds.forEach(id => {
        const student = this.students.find(s => s.id === id);
        if (student) {
          student.status = 'rejected';
        }
      });
      this.showToast('success', `${this.modalStudentIds.length} student(s) rejected successfully!`);
    }
    
    this.selectedStudents.clear();
    this.selectedStudents = new Set();
    this.closeModal();
  }

  handleSingleVerify(studentId: string) {
    this.openModal('verify', studentId);
  }

  handleSingleReject(studentId: string) {
    this.openModal('reject', studentId);
  }

  handleBulkVerify() {
    if (this.selectedCount === 0) return;
    this.openModal('verify', Array.from(this.selectedStudents));
  }

  handleBulkReject() {
    if (this.selectedCount === 0) return;
    this.openModal('reject', Array.from(this.selectedStudents));
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'verified': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'unverified': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'rejected': return 'bg-red-50 text-red-700 border border-red-200';
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

  showToast(type: string, message: string) {
    // Create toast element
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

  getSessionName(): string {
    const session = this.sessions.find(s => s.id === this.selectedSession);
    return session ? session.name : '';
  }
}