import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Subject {
  id: string;
  code: string;
  name: string;
  teacher: string;
  creditHours: number;
  grade: string;
  gradePoints: number;
  attendance: number;
  marks: {
    midterm: number;
    final: number;
    assignment: number;
    quiz: number;
    total: number;
  };
  status: 'completed' | 'ongoing' | 'pending';
}

interface Semester {
  id: string;
  name: string;
  year: number;
  season: 'Spring' | 'Fall' | 'Summer';
  gpa: number;
  totalCredits: number;
  earnedCredits: number;
  status: 'completed' | 'ongoing' | 'upcoming';
}

@Component({
  selector: 'app-semester-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './semester-details.html',
  styleUrls: ['./semester-details.css']
})
export class SemesterDetails implements OnInit {
    private isBrowser: boolean;
  selectedSemester: string = 'semester-4';
  studentName = 'Ahmed Sheikh';
  studentRollNo = 'CS-2024-001';
  cgpa = 3.75;
  totalEarnedCredits = 62;
  totalRequiredCredits = 124;

  semesters: Semester[] = [
    {
      id: 'semester-1',
      name: 'Semester 1',
      year: 2024,
      season: 'Fall',
      gpa: 3.68,
      totalCredits: 16,
      earnedCredits: 16,
      status: 'completed'
    },
    {
      id: 'semester-2',
      name: 'Semester 2',
      year: 2025,
      season: 'Spring',
      gpa: 3.72,
      totalCredits: 17,
      earnedCredits: 17,
      status: 'completed'
    },
    {
      id: 'semester-3',
      name: 'Semester 3',
      year: 2025,
      season: 'Fall',
      gpa: 3.80,
      totalCredits: 16,
      earnedCredits: 16,
      status: 'completed'
    },
    {
      id: 'semester-4',
      name: 'Semester 4',
      year: 2026,
      season: 'Spring',
      gpa: 0,
      totalCredits: 17,
      earnedCredits: 0,
      status: 'ongoing'
    }
  ];

  currentSubjects: Subject[] = [
    {
      id: '1',
      code: 'CS401',
      name: 'Web Development',
      teacher: 'Dr. Sarah Ahmed',
      creditHours: 3,
      grade: 'A',
      gradePoints: 4.0,
      attendance: 92,
      marks: {
        midterm: 85,
        final: 88,
        assignment: 90,
        quiz: 82,
        total: 86
      },
      status: 'ongoing'
    },
    {
      id: '2',
      code: 'CS402',
      name: 'Database Systems',
      teacher: 'Prof. Michael Chen',
      creditHours: 3,
      grade: 'A-',
      gradePoints: 3.7,
      attendance: 88,
      marks: {
        midterm: 82,
        final: 85,
        assignment: 88,
        quiz: 80,
        total: 84
      },
      status: 'ongoing'
    },
    {
      id: '3',
      code: 'CS403',
      name: 'Software Engineering',
      teacher: 'Dr. Umar Farooq',
      creditHours: 3,
      grade: 'B+',
      gradePoints: 3.3,
      attendance: 85,
      marks: {
        midterm: 78,
        final: 80,
        assignment: 85,
        quiz: 75,
        total: 79
      },
      status: 'ongoing'
    },
    {
      id: '4',
      code: 'CS404',
      name: 'Computer Networks',
      teacher: 'Prof. Fatima Zafar',
      creditHours: 3,
      grade: 'A',
      gradePoints: 4.0,
      attendance: 90,
      marks: {
        midterm: 87,
        final: 90,
        assignment: 85,
        quiz: 84,
        total: 87
      },
      status: 'ongoing'
    },
    {
      id: '5',
      code: 'CS405',
      name: 'Final Year Project',
      teacher: 'Dr. Sarah Ahmed',
      creditHours: 3,
      grade: 'In Progress',
      gradePoints: 0,
      attendance: 95,
      marks: {
        midterm: 0,
        final: 0,
        assignment: 85,
        quiz: 0,
        total: 85
      },
      status: 'ongoing'
    },
    {
      id: '6',
      code: 'HUM401',
      name: 'Technical Communication',
      teacher: 'Prof. Ayesha Khan',
      creditHours: 2,
      grade: 'A',
      gradePoints: 4.0,
      attendance: 94,
      marks: {
        midterm: 88,
        final: 92,
        assignment: 90,
        quiz: 86,
        total: 89
      },
      status: 'ongoing'
    }
  ];

  previousSubjects: Subject[] = [
    {
      id: '7',
      code: 'CS301',
      name: 'Object Oriented Programming',
      teacher: 'Dr. Umar Farooq',
      creditHours: 3,
      grade: 'A-',
      gradePoints: 3.7,
      attendance: 90,
      marks: {
        midterm: 84,
        final: 86,
        assignment: 88,
        quiz: 82,
        total: 85
      },
      status: 'completed'
    },
    {
      id: '8',
      code: 'CS302',
      name: 'Data Structures',
      teacher: 'Dr. Sarah Ahmed',
      creditHours: 3,
      grade: 'A',
      gradePoints: 4.0,
      attendance: 92,
      marks: {
        midterm: 88,
        final: 90,
        assignment: 92,
        quiz: 86,
        total: 89
      },
      status: 'completed'
    }
  ];

  selectedSubject: Subject | null = null;
  showMarksModal = false;
 constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit() {
    this.loadStudentData();
  }

 loadStudentData() {
    if (this.isBrowser) {
      const savedName = localStorage.getItem('studentName');
      if (savedName) {
        this.studentName = savedName;
      }
    }
  }

  get selectedSemesterData(): Semester | undefined {
    return this.semesters.find(s => s.id === this.selectedSemester);
  }

  get subjects(): Subject[] {
    if (this.selectedSemester === 'semester-4') {
      return this.currentSubjects;
    }
    return this.previousSubjects;
  }

  get semesterGPA(): number {
    if (this.selectedSemester === 'semester-4') {
      // Calculate ongoing semester GPA
      let totalPoints = 0;
      let totalCredits = 0;
      this.currentSubjects.forEach(subject => {
        if (subject.grade !== 'In Progress') {
          totalPoints += subject.gradePoints * subject.creditHours;
          totalCredits += subject.creditHours;
        }
      });
      return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
    }
    const semester = this.semesters.find(s => s.id === this.selectedSemester);
    return semester ? semester.gpa : 0;
  }

  getGradeColor(grade: string): string {
    if (grade.includes('A')) return 'grade-a';
    if (grade.includes('B')) return 'grade-b';
    if (grade.includes('C')) return 'grade-c';
    if (grade === 'In Progress') return 'grade-progress';
    return 'grade-default';
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'ongoing': return 'status-ongoing';
      case 'upcoming': return 'status-upcoming';
      default: return 'status-default';
    }
  }

  getAttendanceColor(percentage: number): string {
    if (percentage >= 85) return 'attendance-excellent';
    if (percentage >= 75) return 'attendance-good';
    return 'attendance-poor';
  }

  getSemesterIcon(season: string): string {
    switch(season) {
      case 'Spring': return 'fas fa-seedling';
      case 'Fall': return 'fas fa-leaf';
      case 'Summer': return 'fas fa-sun';
      default: return 'fas fa-calendar';
    }
  }

  viewMarks(subject: Subject) {
    this.selectedSubject = subject;
    this.showMarksModal = true;
  }

  closeModal() {
    this.showMarksModal = false;
    this.selectedSubject = null;
  }

  getGradePointLabel(gradePoint: number): string {
    if (gradePoint >= 3.7) return 'Excellent';
    if (gradePoint >= 3.0) return 'Good';
    if (gradePoint >= 2.0) return 'Satisfactory';
    return 'Needs Improvement';
  }
}