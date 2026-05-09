import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, StudentDto, VerifyStudentRequest } from '../../../core/services/admin-services/admin.service';
import { CreateAccountService, Department } from '../../../core/services/account-services/create-account-service';
import { SessionGetDto } from '../../../core/models/admin/session-get.dto';
import { ToastService } from '../../../core/services/toast-service/toast.service';
import { ConfirmDialogService } from '../../../core/services/generic-services/confirm-dialog.service'; 

interface StudentDisplay {
  id: string;
  name: string;
  rollNo: string;
  registrationNo: string;
  department: string;
  status: string;
  email: string;
  cnic: string;
}

@Component({
  selector: 'app-bulk-student-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-student-verification.html',
  styleUrl: './bulk-student-verification.css',
})
export class BulkStudentVerification implements OnInit {
  
  private adminService = inject(AdminService);
  private createAccountService = inject(CreateAccountService);
  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmDialogService);
  private cdr = inject(ChangeDetectorRef);
  
  selectedSession = '';
  selectedDepartmentId = '';
  selectedStatus: string = 'unverified';
  
  sessions: SessionGetDto[] = [];
  departments: Department[] = [];
  students: StudentDisplay[] = [];
  selectedStudents: Set<string> = new Set();
  
  isLoading = false;
  isProcessing = false;

  ngOnInit() {
    this.loadSessions();
    this.loadDepartments();
  }

  loadSessions() {
    this.adminService.getSessionsByStatus(1).subscribe({
      next: (res) => {
        this.sessions = res.data;
        if (this.sessions.length > 0) {
          this.selectedSession = this.sessions[0].sessionId;
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
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadStudents() {
    if (!this.selectedSession || !this.selectedDepartmentId) return;
    
    this.isLoading = true;
    this.selectedStudents.clear();
    this.cdr.detectChanges();

    const statusMap: Record<string, number> = {
      'unverified': 1,
      'verified': 2,
      'rejected': 3
    };

    this.adminService.getStudentsBySessionAndDept(
      this.selectedSession,
      this.selectedDepartmentId,
      statusMap[this.selectedStatus]
    ).subscribe({
      next: (res) => {
        this.students = res.data.map(s => ({
          id: s.studentId,
          name: s.studentName,
          rollNo: s.rollNo,
          registrationNo: s.registrationNo,
          department: s.department,
          status: s.status.toLowerCase(),
          email: s.studentEmail,
          cnic: s.cnic
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

  onFilterChange() {
    this.loadStudents();
  }

  get filteredStudents(): StudentDisplay[] {
    return this.students;
  }

  get selectedCount(): number {
    return this.selectedStudents.size;
  }

  get isAllSelected(): boolean {
    return this.filteredStudents.length > 0 && 
           this.filteredStudents.every(s => this.selectedStudents.has(s.id));
  }

  toggleSelectAll() {
    if (this.isAllSelected) {
      this.filteredStudents.forEach(s => this.selectedStudents.delete(s.id));
    } else {
      this.filteredStudents.forEach(s => this.selectedStudents.add(s.id));
    }
    this.selectedStudents = new Set(this.selectedStudents);
    this.cdr.detectChanges();
  }

  toggleStudent(id: string) {
    if (this.selectedStudents.has(id)) {
      this.selectedStudents.delete(id);
    } else {
      this.selectedStudents.add(id);
    }
    this.selectedStudents = new Set(this.selectedStudents);
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.loadStudents();
  }

  getStatusCount(status: string): number {
    return this.students.filter(s => s.status === status).length;
  }

  async handleBulkVerify() {
    if (this.selectedCount === 0) return;
    
    const confirmed = await this.confirmDialog.confirm({
      title: 'Verify Students?',
      message: `Are you sure you want to verify <b>${this.selectedCount}</b> selected student(s)?`,
      confirmText: 'Yes, Verify',
      cancelText: 'Cancel',
      type: 'info',
      icon: 'fas fa-check-circle'
    });
    
    if (!confirmed) return;
    
    this.processVerification(Array.from(this.selectedStudents), 2);
  }

  async handleBulkReject() {
    if (this.selectedCount === 0) return;
    
    const confirmed = await this.confirmDialog.confirm({
      title: 'Reject Students?',
      message: `Are you sure you want to reject <b>${this.selectedCount}</b> selected student(s)?`,
      confirmText: 'Yes, Reject',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-times-circle'
    });
    
    if (!confirmed) return;
    
    this.processVerification(Array.from(this.selectedStudents), 3);
  }

  async handleSingleVerify(studentId: string) {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Verify Student?',
      message: 'Are you sure you want to verify this student?',
      confirmText: 'Yes, Verify',
      cancelText: 'Cancel',
      type: 'info',
      icon: 'fas fa-check-circle'
    });
    
    if (!confirmed) return;
    
    this.processVerification([studentId], 2);
  }

  async handleSingleReject(studentId: string) {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Reject Student?',
      message: 'Are you sure you want to reject this student?',
      confirmText: 'Yes, Reject',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-times-circle'
    });
    
    if (!confirmed) return;
    
    this.processVerification([studentId], 3);
  }

processVerification(studentIds: string[], status: number) {
  this.isProcessing = true;
  this.cdr.detectChanges();

  const request: VerifyStudentRequest = {
    studentIds: studentIds,
    status: status
  };

  this.adminService.verifyStudents(request).subscribe({
    next: (res) => {
      this.isProcessing = false;
      this.selectedStudents.clear();
      this.cdr.detectChanges();
      
      // Show detailed success message
      const result = res.data;
      let message = `${result.success} student(s) updated successfully!`;
      if (result.failed > 0) {
        message += ` ${result.failed} failed.`;
      }
      if (result.alreadyVerified.length > 0) {
        message += ` ${result.alreadyVerified.length} already processed.`;
      }
      
      this.toast.success(message);
      this.loadStudents();
    },
    error: (err) => {
      this.isProcessing = false;
      this.cdr.detectChanges();
      this.toast.error(err.error?.message || 'Failed to update students');
    }
  });
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

  getSessionName(): string {
    const session = this.sessions.find(s => s.sessionId === this.selectedSession);
    return session ? session.name : '';
  }
}