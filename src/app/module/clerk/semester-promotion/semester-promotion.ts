import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../../core/services/admin-services/admin.service';
import { CreateAccountService, Department } from '../../../core/services/account-services/create-account-service';
import { SessionGetDto } from '../../../core/models/admin/session-get.dto';
import { SemesterDto } from '../../../core/models/clerk-models/semester.dto';
import { ToastService } from '../../../core/services/toast-service/toast.service';
import { ConfirmDialogService } from '../../../core/services/generic-services/confirm-dialog.service';

interface PromotionResult {
  studentId: string;
  studentName?: string;
  rollNo?: string;
  currentSemesterId: string;
  nextSemesterId: string | null;
  gpa: number;
  cgpa: number;
  failedSubjects: number;
  isPromoted: boolean;
  isOnProbation: boolean;
  status: string;
}

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  status: number;
}

@Component({
  selector: 'app-semester-promotion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './semester-promotion.html',
  styleUrl: './semester-promotion.css',
})
export class SemesterPromotion implements OnInit {
  
  private http = inject(HttpClient);
  private adminService = inject(AdminService);
  private createAccountService = inject(CreateAccountService);
  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmDialogService);
  private cdr = inject(ChangeDetectorRef);
  
  sessions: SessionGetDto[] = [];
  departments: Department[] = [];
  semesters: SemesterDto[] = [];
  
  selectedSessionId = '';
  selectedDepartmentId = '';
  selectedSemesterId = '';
  
  results: PromotionResult[] = [];
  isLoading = false;
  isProcessing = false;
  
  promotionStats = {
    total: 0,
    promoted: 0,
    probation: 0,
    repeat: 0
  };

  ngOnInit() {
    this.loadSessions();
    this.loadDepartments();
  }

  loadSessions() {
    this.adminService.getSessionsByStatus(1).subscribe({
      next: (res) => {
        this.sessions = res.data;
        this.cdr.detectChanges();
      }
    });
  }

  loadDepartments() {
    this.createAccountService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data;
        this.cdr.detectChanges();
      }
    });
  }

  onSessionChange() {
    this.selectedSemesterId = '';
    this.semesters = [];
    this.results = [];
    
    if (this.selectedSessionId) {
      this.http.get<ApiResponse<SemesterDto[]>>(
        `https://localhost:5001/api/Semester/get-Semester-by-sessionId?sessionId=${this.selectedSessionId}`,
        { withCredentials: true }
      ).subscribe({
        next: (res) => {
          this.semesters = res.data;
          this.cdr.detectChanges();
        }
      });
    }
  }

  async processFullBatchPromotion() {
    if (!this.selectedSemesterId || !this.selectedDepartmentId) {
      this.toast.error('Please select session, department & semester');
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Promote Full Batch?',
      message: 'This will evaluate and promote all students in the selected semester. Continue?',
      confirmText: 'Yes, Promote All',
      cancelText: 'Cancel',
      type: 'info',
      icon: 'fas fa-arrow-up'
    });

    if (!confirmed) return;

    this.isProcessing = true;
    this.cdr.detectChanges();

    const payload = {
      semesterId: this.selectedSemesterId,
      departmentId: this.selectedDepartmentId
    };

    this.http.post<ApiResponse<PromotionResult[]>>(
      'https://localhost:5001/api/SemesterPromotion/full-batch-semester-Promotion',
      payload,
      { withCredentials: true }
    ).subscribe({
      next: (res) => {
        this.results = res.data;
        this.calculateStats();
        this.isProcessing = false;
        this.toast.success(res.message);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isProcessing = false;
        this.toast.error(err.error?.message || 'Promotion failed');
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    this.promotionStats.total = this.results.length;
    this.promotionStats.promoted = this.results.filter(r => r.status === 'Promoted').length;
    this.promotionStats.probation = this.results.filter(r => r.status === 'Promoted with Probation').length;
    this.promotionStats.repeat = this.results.filter(r => r.status === 'Repeat Semester').length;
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'Promoted') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status.includes('Probation')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (status.includes('Repeat')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-slate-100 text-slate-700';
  }

  getStatusIcon(status: string): string {
    if (status === 'Promoted') return 'fas fa-check-circle';
    if (status.includes('Probation')) return 'fas fa-exclamation-triangle';
    if (status.includes('Repeat')) return 'fas fa-redo';
    return 'fas fa-question-circle';
  }

  getSessionName(): string {
    const s = this.sessions.find(x => x.sessionId === this.selectedSessionId);
    return s ? s.name : '-';
  }

  getDepartmentName(): string {
    const d = this.departments.find(x => x.departmentId === this.selectedDepartmentId);
    return d ? d.name : '-';
  }

  getSemesterName(): string {
    const s = this.semesters.find(x => x.semesterId === this.selectedSemesterId);
    return s ? s.name : '-';
  }

  resetAll() {
    this.results = [];
    this.promotionStats = { total: 0, promoted: 0, probation: 0, repeat: 0 };
    this.cdr.detectChanges();
  }
}