import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, StudentDto } from '../../../core/services/admin-services/admin.service';
import { CreateAccountService, Department } from '../../../core/services/account-services/create-account-service';
import { SessionGetDto } from '../../../core/models/admin/session-get.dto';
import { ToastService } from '../../../core/services/toast-service/toast.service';

interface StudentDisplay {
  studentId: string;
  name: string;
  rollNo: string;
  registrationNo: string;
  email: string;
  department: string;
  status: string;
  cnic: string;
  semesterName : string;
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
  
  private adminService = inject(AdminService);
  private createAccountService = inject(CreateAccountService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  
  selectedSession = '';
  selectedDepartmentId = '';
  
  sessions: SessionGetDto[] = [];
  departments: Department[] = [];
  students: StudentDisplay[] = [];
  
  isLoading = false;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.adminService.getSessionsByStatus(1).subscribe({
      next: (res) => {
        this.sessions = res.data;
        if (this.sessions.length > 0) {
          this.selectedSession = this.sessions[0].sessionId;
          this.loadDepartments();
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadDepartments() {
    this.createAccountService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data;
        if (this.departments.length > 0) {
          this.selectedDepartmentId = this.departments[0].departmentId;
          this.loadStudents();
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadStudents() {
    if (!this.selectedSession || !this.selectedDepartmentId) return;
    
    this.isLoading = true;
    this.cdr.detectChanges();

    // Status 2 = Verified students (enrolled)
    this.adminService.getStudentsBySessionAndDept(
      this.selectedSession,
      this.selectedDepartmentId,
      2
    ).subscribe({
      next: (res) => {
        this.students = res.data.map(s => ({
          studentId: s.studentId,
          name: s.studentName,
          rollNo: s.rollNo,
          registrationNo: s.registrationNo,
          email: s.studentEmail,
          department: s.department,
          status: s.status.toLowerCase(),
          cnic: s.cnic,
          semesterName: s.semesterName
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load students');
      }
    });
  }

  onSessionChange() {
    this.currentPage = 1;
    this.loadStudents();
  }

  onDepartmentChange() {
    this.currentPage = 1;
    this.loadStudents();
  }

  get filteredStudents(): StudentDisplay[] {
    if (!this.searchTerm) return this.students;
    const term = this.searchTerm.toLowerCase();
    return this.students.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.rollNo.toLowerCase().includes(term) ||
      s.registrationNo.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.cnic.includes(term)
    );
  }

  get paginatedStudents(): StudentDisplay[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.pageSize) || 1;
  }

  get startItem(): number {
    return this.filteredStudents.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredStudents.length);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getTotalPagesArray(): number[] {
    const pages = this.totalPages;
    if (pages <= 7) return Array(pages).fill(0).map((_, i) => i + 1);
    const result: number[] = [];
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        result.push(i);
      }
    }
    return result;
  }

  getDepartmentCount(): number {
    return this.students.length;
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getSessionName(): string {
    const session = this.sessions.find(s => s.sessionId === this.selectedSession);
    return session ? session.name : '';
  }

  getDepartmentName(): string {
    const dept = this.departments.find(d => d.departmentId === this.selectedDepartmentId);
    return dept ? dept.name : '';
  }

  viewStudentDetails(studentId: string) {
    this.toast.info('Student details coming soon!');
  }

  editStudent(studentId: string) {
    this.toast.info('Edit student coming soon!');
  }
}