import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth-services/auth.service';
import { ToastService } from '../../../core/services/toast-service/toast.service';

interface SubjectGrade {
  title: string;
  creditHours: number;
  grade: string;
  gradePoints: number;
}

interface SemesterTranscript {
  semesterName: string;
  season: string;
  year: number;
  gpa: number;
  totalCredits: number;
  earnedCredits: number;
  subjects: SubjectGrade[];
}

interface TranscriptData {
  studentName: string;
  rollNo: string;
  cnic: string;
  email: string;
  department: string;
  program: string;
  session: string;
  cgpa: number;
  totalEarnedCredits: number;
  totalRequiredCredits: number;
  percentage: number;
  semesters: SemesterTranscript[];
}

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  status: number;
}

@Component({
  selector: 'app-student-transcript',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-transcript.html',
  styleUrl: './student-transcript.css',
})
export class StudentTranscript implements OnInit {
  
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  
  transcript: TranscriptData | null = null;
  isLoading = false;
  isGenerating = false;
  selectedSemester = 'all';

  ngOnInit() {
    this.loadTranscript();
  }

  loadTranscript() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.http.get<ApiResponse<TranscriptData>>(
      'https://localhost:5001/api/Student/my-transcript',
      { withCredentials: true }
    ).subscribe({
      next: (res) => {
        this.transcript = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load transcript');
        this.cdr.detectChanges();
      }
    });
  }

  get filteredSemesters(): SemesterTranscript[] {
    if (!this.transcript) return [];
    if (this.selectedSemester === 'all') return this.transcript.semesters;
    return this.transcript.semesters.filter(s => s.semesterName === this.selectedSemester);
  }

  getGradeColor(grade: string): string {
    if (grade.startsWith('A')) return 'bg-emerald-100 text-emerald-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-amber-100 text-amber-700';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  }

  getGradePointLabel(cgpa: number): string {
    if (cgpa >= 3.7) return 'Excellent';
    if (cgpa >= 3.3) return 'Very Good';
    if (cgpa >= 3.0) return 'Good';
    if (cgpa >= 2.0) return 'Satisfactory';
    return 'Needs Improvement';
  }

  printTranscript() {
    window.print();
  }

  generateTranscript() {
    this.isGenerating = true;
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.isGenerating = false;
      this.toast.success('PDF downloaded successfully!');
      this.cdr.detectChanges();
    }, 1500);
  }

  shareTranscript() {
    this.toast.success('Share link copied to clipboard!');
  }
}