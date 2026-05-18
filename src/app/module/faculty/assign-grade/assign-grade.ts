import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FacultyService,FacultySubject, EnrolledStudent, GradeRequest } from '../../../core/services/faculty-services/faculty-servce';
import { ToastService } from '../../../core/services/toast-service/toast.service';

@Component({
  selector: 'app-assign-grade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-grade.html',
  styleUrl: './assign-grade.css',
})
export class AssignGrade implements OnInit {
  
  private facultyService = inject(FacultyService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  
  subjects: FacultySubject[] = [];
  selectedSubjectId = '';
  selectedSubject: FacultySubject | null = null;
  
  students: EnrolledStudent[] = [];
  isLoading = false;
  isSaving = false;
  
  // Search & Pagination
  searchTerm = '';
  statusFilter = 'all';
  currentPage = 1;
  pageSize = 8;
  
  // Grade Modal
  showGradeModal = false;
  selectedStudent: EnrolledStudent | null = null;
  
  gradeForm = {
    midtermMarks: 0,
    finalMarks: 0,
    assignmentMarks: 0,
    quizMarks: 0
  };

  // ✅ Updated marks distribution
  marksDistribution = {
    total: 60,
    final: 36,
    midterm: 15,
    assignment: 5,
    quiz: 4
  };

  ngOnInit() {
    this.loadMySubjects();
  }

  loadMySubjects() {
    this.isLoading = true;
    this.facultyService.getMySubjects().subscribe({
      next: (res) => {
        this.subjects = res.data;
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

  onSubjectChange() {
    this.students = [];
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.currentPage = 1;
    this.selectedSubject = this.subjects.find(s => s.subjectId === this.selectedSubjectId) || null;
    
    if (this.selectedSubjectId) {
      this.loadEnrolledStudents();
    }
  }

  loadEnrolledStudents() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.facultyService.getEnrolledStudents(this.selectedSubjectId).subscribe({
      next: (res) => {
        this.students = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load students');
        this.cdr.detectChanges();
      }
    });
  }

  get filteredStudents(): EnrolledStudent[] {
    let filtered = this.students;
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.studentName.toLowerCase().includes(term) || 
        s.rollNo.toLowerCase().includes(term)
      );
    }
    
    if (this.statusFilter === 'graded') {
      filtered = filtered.filter(s => s.gradeId !== null);
    } else if (this.statusFilter === 'pending') {
      filtered = filtered.filter(s => s.gradeId === null);
    }
    
    return filtered;
  }

  get paginatedStudents(): EnrolledStudent[] {
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

  getGradedCount(): number {
    return this.students.filter(s => s.gradeId !== null).length;
  }

  getPendingCount(): number {
    return this.students.filter(s => s.gradeId === null).length;
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const names = name.split(' ');
    return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  getGradeBadgeClass(grade: string): string {
    if (grade.startsWith('A')) return 'bg-emerald-100 text-emerald-700 shadow-emerald-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700 shadow-blue-200';
    if (grade.startsWith('C')) return 'bg-amber-100 text-amber-700 shadow-amber-200';
    return 'bg-red-100 text-red-700 shadow-red-200';
  }

  getGradeColor(grade: string | null): string {
    if (!grade) return 'text-slate-400';
    if (grade.startsWith('A')) return 'text-emerald-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-amber-600';
    return 'text-red-600';
  }

  hasGrade(student: EnrolledStudent): boolean {
    return student.gradeId !== null;
  }

  openGradeModal(student: EnrolledStudent) {
    this.selectedStudent = student;
    this.gradeForm = {
      midtermMarks: student.midtermMarks ?? 0,
      finalMarks: student.finalMarks ?? 0,
      assignmentMarks: student.assignmentMarks ?? 0,
      quizMarks: student.quizMarks ?? 0
    };
    this.showGradeModal = true;
    this.cdr.detectChanges();
  }

  closeGradeModal() {
    this.showGradeModal = false;
    this.selectedStudent = null;
    this.cdr.detectChanges();
  }

  getTotalMarks(): number {
    return this.gradeForm.midtermMarks + this.gradeForm.finalMarks + this.gradeForm.assignmentMarks + this.gradeForm.quizMarks;
  }

  saveGrade() {
  if (!this.selectedStudent) return;

  // ✅ Individual max validation
  if (this.gradeForm.finalMarks > this.marksDistribution.final) {
    this.toast.error(`Final marks cannot exceed ${this.marksDistribution.final}`);
    return;
  }
  if (this.gradeForm.midtermMarks > this.marksDistribution.midterm) {
    this.toast.error(`Midterm marks cannot exceed ${this.marksDistribution.midterm}`);
    return;
  }
  if (this.gradeForm.assignmentMarks > this.marksDistribution.assignment) {
    this.toast.error(`Assignment marks cannot exceed ${this.marksDistribution.assignment}`);
    return;
  }
  if (this.gradeForm.quizMarks > this.marksDistribution.quiz) {
    this.toast.error(`Quiz marks cannot exceed ${this.marksDistribution.quiz}`);
    return;
  }

  // ✅ Total max validation
  const total = this.getTotalMarks();
  if (total > this.marksDistribution.total) {
    this.toast.error(`Total marks cannot exceed ${this.marksDistribution.total}`);
    return;
  }

  this.isSaving = true;
  this.cdr.detectChanges();

  const payload: GradeRequest = {
    enrollmentId: this.selectedStudent.enrollmentId,
    midtermMarks: this.gradeForm.midtermMarks,
    finalMarks: this.gradeForm.finalMarks,
    assignmentMarks: this.gradeForm.assignmentMarks,
    quizMarks: this.gradeForm.quizMarks
  };

  this.facultyService.assignGrade(payload).subscribe({
    next: (res) => {
      this.isSaving = false;
      this.closeGradeModal();
      this.toast.success(res.message || 'Grade assigned successfully!');
      this.loadEnrolledStudents();
    },
    error: (err) => {
      this.isSaving = false;
      this.cdr.detectChanges();
      this.toast.error(err.error?.message || 'Failed to assign grade');
    }
  });
}
}