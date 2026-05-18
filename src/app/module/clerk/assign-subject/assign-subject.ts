import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClerkService, SubjectRequest, SubjectItem } from '../../../core/services/clerk-service/clerk.service';
import { AdminService } from '../../../core/services/admin-services/admin.service';
import { CreateAccountService, Department } from '../../../core/services/account-services/create-account-service';
import { SessionGetDto } from '../../../core/models/admin/session-get.dto';
import { SemesterDto } from '../../../core/models/clerk-models/semester.dto';
import { FacultyDto } from '../../../core/models/clerk-models/faculty.dto';
import { ToastService } from '../../../core/services/toast-service/toast.service';
import { ConfirmDialogService } from '../../../core/services/generic-services/confirm-dialog.service';

@Component({
  selector: 'app-assign-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-subject.html',
  styleUrl: './assign-subject.css',
})
export class AssignSubject implements OnInit {
  
  private clerkService = inject(ClerkService);
  private adminService = inject(AdminService);
  private createAccountService = inject(CreateAccountService);
  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmDialogService);
  private cdr = inject(ChangeDetectorRef);
  
  // Dropdown data
  sessions: SessionGetDto[] = [];
  departments: Department[] = [];
  semesters: SemesterDto[] = [];
  faculties: FacultyDto[] = [];
  
  // Selected values
  selectedSessionId = '';
  selectedDepartmentId = '';
  selectedSemesterId = '';
  
  // Subjects
  subjects: SubjectItem[] = [];
  isLoading = false;
  isSaving = false;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  
  // Modal
  showModal = false;
  isEditing = false;
  editingSubjectId = '';
  
  subjectForm = {
    title: '',
    facultyId: '',
    creditHours: 3
  };

  creditHourOptions = [1, 2, 3, 4];

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
    this.subjects = [];
    this.faculties = [];
    
    if (this.selectedSessionId) {
      this.clerkService.getSemestersBySession(this.selectedSessionId).subscribe({
        next: (res) => {
          this.semesters = res.data;
          this.cdr.detectChanges();
        }
      });
    }
  }

  onDepartmentChange() {
    this.faculties = [];
    this.subjects = [];
    
    if (this.selectedDepartmentId) {
      this.clerkService.getFacultyByDepartment(this.selectedDepartmentId).subscribe({
        next: (res) => {
          this.faculties = res.data;
          this.cdr.detectChanges();
        }
      });
      if (this.selectedSemesterId) {
        this.loadSubjects();
      }
    }
  }

  onSemesterChange() {
    this.subjects = [];
    if (this.selectedDepartmentId && this.selectedSemesterId) {
      this.loadSubjects();
    }
  }

  loadSubjects() {
    if (!this.selectedDepartmentId || !this.selectedSemesterId) return;
    
    this.isLoading = true;
    this.cdr.detectChanges();

    this.clerkService.getSubjectsByDeptAndSemester(
      this.selectedDepartmentId,
      this.selectedSemesterId,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (res) => {
        this.subjects = res.data.items;
        this.totalRecords = res.data.totalRecords;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load subjects');
        this.cdr.detectChanges();
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadSubjects();
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

  getSessionName(): string {
    const s = this.sessions.find(x => x.sessionId === this.selectedSessionId);
    return s ? s.name : '-';
  }

  getDepartmentName(): string {
    const d = this.departments.find(x => x.departmentId === this.selectedDepartmentId);
    return d ? d.name : '-';
  }

  getSemesterName(semesterId: string): string {
    const s = this.semesters.find(x => x.semesterId === semesterId);
    return s ? s.name : '-';
  }

  getFacultyName(facultyId: string | null): string {
    if (!facultyId) return 'Not Assigned';
    const f = this.faculties.find(x => x.facultyId === facultyId);
    return f ? f.fullName : 'Unknown';
  }

  getCreditHoursText(hours: number): string {
    return `${hours} Credit Hr${hours > 1 ? 's' : ''}`;
  }

  openCreateModal() {
    this.isEditing = false;
    this.editingSubjectId = '';
    this.subjectForm = { title: '', facultyId: '', creditHours: 3 };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(subject: SubjectItem) {
    this.isEditing = true;
    this.editingSubjectId = subject.subjectId;
    this.subjectForm = {
      title: subject.title,
      facultyId: subject.facultyId || '',
      creditHours: subject.creditHours || 3
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  saveSubject() {
    if (!this.subjectForm.title.trim()) {
      this.toast.error('Please enter subject title');
      return;
    }

    this.isSaving = true;
    this.cdr.detectChanges();

    const facultyId = this.subjectForm.facultyId?.trim() 
      ? this.subjectForm.facultyId 
      : null;

    const payload: SubjectRequest = {
      title: this.subjectForm.title.trim(),
      departmentId: this.selectedDepartmentId,
      semesterId: this.selectedSemesterId,
      facultyId: facultyId,
      creditHours: this.subjectForm.creditHours
    };

    if (this.isEditing) {
      this.clerkService.updateSubject({
        ...payload,
        subjectId: this.editingSubjectId,
        isActive: true
      }).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.toast.success('Subject updated successfully!');
          this.loadSubjects();
        },
        error: (err) => {
          this.isSaving = false;
          this.cdr.detectChanges();
          if (err.error?.errors) {
            const messages = err.error.errors.map((e: any) => e.errors.join(', ')).join(' | ');
            this.toast.error(messages);
          } else {
            this.toast.error(err.error?.message || 'Failed to update subject');
          }
        }
      });
    } else {
      this.clerkService.createSubject(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.toast.success('Subject created successfully!');
          this.loadSubjects();
        },
        error: (err) => {
          this.isSaving = false;
          this.cdr.detectChanges();
          if (err.error?.errors) {
            const messages = err.error.errors.map((e: any) => e.errors.join(', ')).join(' | ');
            this.toast.error(messages);
          } else {
            this.toast.error(err.error?.message || 'Failed to create subject');
          }
        }
      });
    }
  }

  async deleteSubject(subjectId: string) {
    const subject = this.subjects.find(s => s.subjectId === subjectId);
    
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Subject?',
      message: `Are you sure you want to delete <b>${subject?.title || 'this subject'}</b>? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'fas fa-trash-alt'
    });

    if (!confirmed) return;

    this.clerkService.deleteSubject(subjectId).subscribe({
      next: () => {
        this.toast.success('Subject deleted successfully!');
        this.loadSubjects();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to delete subject');
      }
    });
  }
}