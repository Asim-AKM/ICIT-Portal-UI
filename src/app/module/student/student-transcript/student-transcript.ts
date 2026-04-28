import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SemesterResult {
  semester: string;
  year: number;
  season: string;
  gpa: number;
  totalCredits: number;
  earnedCredits: number;
  subjects: SubjectResult[];
}

interface SubjectResult {
  code: string;
  name: string;
  creditHours: number;
  grade: string;
  gradePoints: number;
}

@Component({
  selector: 'app-student-transcript',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-transcript.html',
  styleUrls: ['./student-transcript.css']
})
export class StudentTranscript implements OnInit {
  Math = Math;
  private isBrowser: boolean;
  
  studentName = 'Ahmed Sheikh';
  studentRollNo = 'CS-2024-001';
  studentFatherName = 'Mohammad Sheikh';
  studentCNIC = '42101-1234567-8';
  studentProgram = 'Bachelor of Science in Computer Science';
  studentDepartment = 'Computer Science';
  studentEmail = 'ahmed.sheikh@icit.edu.pk';
  studentPhone = '+92-300-1234567';
  cgpa = 3.75;
  totalEarnedCredits = 62;
  totalRequiredCredits = 124;
  percentage = 78.5;
  
  isGenerating = false;
  selectedSemester: string = 'all';
  
  semesters: SemesterResult[] = [
    {
      semester: 'Semester 1',
      year: 2024,
      season: 'Fall',
      gpa: 3.68,
      totalCredits: 16,
      earnedCredits: 16,
      subjects: [
        { code: 'CS101', name: 'Introduction to Computing', creditHours: 3, grade: 'A', gradePoints: 4.0 },
        { code: 'CS102', name: 'Programming Fundamentals', creditHours: 3, grade: 'A-', gradePoints: 3.7 },
        { code: 'MA101', name: 'Calculus I', creditHours: 3, grade: 'B+', gradePoints: 3.3 },
        { code: 'EN101', name: 'English Composition', creditHours: 2, grade: 'A', gradePoints: 4.0 },
        { code: 'PH101', name: 'Applied Physics', creditHours: 3, grade: 'B+', gradePoints: 3.3 },
        { code: 'IS101', name: 'Islamic Studies', creditHours: 2, grade: 'A-', gradePoints: 3.7 }
      ]
    },
    {
      semester: 'Semester 2',
      year: 2025,
      season: 'Spring',
      gpa: 3.72,
      totalCredits: 17,
      earnedCredits: 17,
      subjects: [
        { code: 'CS201', name: 'Object Oriented Programming', creditHours: 3, grade: 'A-', gradePoints: 3.7 },
        { code: 'CS202', name: 'Data Structures', creditHours: 3, grade: 'A', gradePoints: 4.0 },
        { code: 'MA201', name: 'Discrete Mathematics', creditHours: 3, grade: 'B+', gradePoints: 3.3 },
        { code: 'CS203', name: 'Digital Logic Design', creditHours: 3, grade: 'A-', gradePoints: 3.7 },
        { code: 'PK201', name: 'Pakistan Studies', creditHours: 2, grade: 'A', gradePoints: 4.0 },
        { code: 'CS204', name: 'Web Technologies', creditHours: 3, grade: 'A', gradePoints: 4.0 }
      ]
    },
    {
      semester: 'Semester 3',
      year: 2025,
      season: 'Fall',
      gpa: 3.80,
      totalCredits: 16,
      earnedCredits: 16,
      subjects: [
        { code: 'CS301', name: 'Database Systems', creditHours: 3, grade: 'A', gradePoints: 4.0 },
        { code: 'CS302', name: 'Operating Systems', creditHours: 3, grade: 'A-', gradePoints: 3.7 },
        { code: 'CS303', name: 'Software Engineering', creditHours: 3, grade: 'B+', gradePoints: 3.3 },
        { code: 'MA301', name: 'Linear Algebra', creditHours: 3, grade: 'A', gradePoints: 4.0 },
        { code: 'CS304', name: 'Computer Networks', creditHours: 3, grade: 'A-', gradePoints: 3.7 },
        { code: 'CS305', name: 'Human Computer Interaction', creditHours: 2, grade: 'A', gradePoints: 4.0 }
      ]
    },
    {
      semester: 'Semester 4',
      year: 2026,
      season: 'Spring',
      gpa: 3.85,
      totalCredits: 17,
      earnedCredits: 17,
      subjects: [
        { code: 'CS401', name: 'Web Development', creditHours: 3, grade: 'A', gradePoints: 4.0 },
        { code: 'CS402', name: 'Database Systems', creditHours: 3, grade: 'A-', gradePoints: 3.7 },
        { code: 'CS403', name: 'Software Engineering', creditHours: 3, grade: 'B+', gradePoints: 3.3 },
        { code: 'CS404', name: 'Computer Networks', creditHours: 3, grade: 'A', gradePoints: 4.0 },
        { code: 'CS405', name: 'Final Year Project', creditHours: 3, grade: 'In Progress', gradePoints: 0 },
        { code: 'HUM401', name: 'Technical Communication', creditHours: 2, grade: 'A', gradePoints: 4.0 }
      ]
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadStudentData();
  }

  loadStudentData() {
    if (this.isBrowser) {
      const savedName = localStorage.getItem('studentName');
      if (savedName) this.studentName = savedName;
    }
  }

  get filteredSemesters(): SemesterResult[] {
    if (this.selectedSemester === 'all') {
      return this.semesters;
    }
    return this.semesters.filter(s => s.semester === this.selectedSemester);
  }

  get overallGPA(): number {
    let totalPoints = 0;
    let totalCredits = 0;
    this.semesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        if (subject.grade !== 'In Progress') {
          totalPoints += subject.gradePoints * subject.creditHours;
          totalCredits += subject.creditHours;
        }
      });
    });
    return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
  }

  getGradeColor(grade: string): string {
    if (grade.includes('A')) return 'grade-a';
    if (grade.includes('B')) return 'grade-b';
    if (grade.includes('C')) return 'grade-c';
    if (grade === 'In Progress') return 'grade-progress';
    return 'grade-default';
  }

  getGradePointLabel(gradePoint: number): string {
    if (gradePoint >= 3.7) return 'Excellent';
    if (gradePoint >= 3.0) return 'Good';
    if (gradePoint >= 2.0) return 'Satisfactory';
    return 'Needs Improvement';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  generateTranscript() {
    this.isGenerating = true;
    
    // Simulate PDF generation delay
    setTimeout(() => {
      this.isGenerating = false;
      this.showToast('success', 'Transcript is being downloaded...');
      
      // In production, this would call a PDF generation service
      // For now, we'll simulate a download
      this.downloadTranscript();
    }, 2000);
  }

  downloadTranscript() {
    if (!this.isBrowser) return;
    
    // This is a placeholder for actual PDF generation
    // In production, you would use a library like jsPDF or call an API
    const transcriptData = {
      studentName: this.studentName,
      rollNo: this.studentRollNo,
      cgpa: this.cgpa,
      totalCredits: this.totalEarnedCredits,
      semesters: this.semesters
    };
    
    console.log('Downloading transcript:', transcriptData);
    
    // Simulate file download
    const blob = new Blob([JSON.stringify(transcriptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Transcript_${this.studentRollNo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  shareTranscript() {
    this.showToast('info', 'Share functionality coming soon!');
  }

  printTranscript() {
    if (!this.isBrowser) return;
    window.print();
  }

  showToast(type: string, message: string) {
    if (!this.isBrowser) return;
    
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