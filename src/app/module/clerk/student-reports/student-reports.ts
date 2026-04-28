import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface StudentReport {
  id: string;
  rollNo: string;
  name: string;
  program: string;
  department: string;
  semester: number;
  session: string;
  cgpa: number;
  status: string;
  enrollmentDate: Date;
  email: string;
  phone: string;
}

interface DepartmentWiseCount {
  department: string;
  count: number;
  percentage: number;
}

interface ProgramWiseCount {
  program: string;
  count: number;
  percentage: number;
}

interface SemesterWiseCount {
  semester: number;
  count: number;
  percentage: number;
}

interface SessionWiseCount {
  session: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-student-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-reports.html',
  styleUrls: ['./student-reports.css']
})
export class StudentReports implements OnInit {
  Math = Math;
  private isBrowser: boolean;
  
  // Active Tab
  activeTab: string = 'student-list';
  
  // Filters
  searchTerm: string = '';
  selectedProgram: string = 'all';
  selectedDepartment: string = 'all';
  selectedSemester: string = 'all';
  selectedSession: string = 'all';
  selectedStatus: string = 'all';
  
  // Date Range
  startDate: string = '';
  endDate: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  // Data
  students: StudentReport[] = [];
  filteredStudents: StudentReport[] = [];
  
  // Statistics
  totalStudents: number = 0;
  totalActive: number = 0;
  totalGraduated: number = 0;
  totalSuspended: number = 0;
  
  // Chart Data
  departmentWise: DepartmentWiseCount[] = [];
  programWise: ProgramWiseCount[] = [];
  semesterWise: SemesterWiseCount[] = [];
  sessionWise: SessionWiseCount[] = [];
  
  // Filter Options
  programs: string[] = ['BSCS', 'BSSE', 'BSIT', 'BSAI', 'BSDS'];
  departments: string[] = ['Computer Science', 'Software Engineering', 'Information Technology', 'Artificial Intelligence', 'Data Science'];
  semesters: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  sessions: string[] = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'];
  statuses: string[] = ['active', 'inactive', 'graduated', 'suspended'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.setDefaultDates();
  }

  ngOnInit() {
    this.loadStudents();
    this.applyFilters();
    this.calculateStatistics();
    this.loadChartData();
  }

  setDefaultDates() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    this.startDate = startOfYear.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  loadStudents() {
    // Mock data - replace with API call
    this.students = [
      { id: '1', rollNo: 'CS-2024-001', name: 'Ahmed Sheikh', program: 'BSCS', department: 'Computer Science', semester: 4, session: 'Fall 2024', cgpa: 3.75, status: 'active', enrollmentDate: new Date('2024-08-15'), email: 'ahmed@icit.edu.pk', phone: '+92-300-1234567' },
      { id: '2', rollNo: 'CS-2024-002', name: 'Kashif Farooq', program: 'BSCS', department: 'Computer Science', semester: 4, session: 'Fall 2024', cgpa: 3.45, status: 'active', enrollmentDate: new Date('2024-08-15'), email: 'kashif@icit.edu.pk', phone: '+92-300-7654321' },
      { id: '3', rollNo: 'SE-2024-015', name: 'Zain Ali', program: 'BSSE', department: 'Software Engineering', semester: 4, session: 'Fall 2024', cgpa: 3.20, status: 'active', enrollmentDate: new Date('2024-08-16'), email: 'zain@icit.edu.pk', phone: '+92-300-9876543' },
      { id: '4', rollNo: 'CS-2024-008', name: 'Fatima Zahra', program: 'BSCS', department: 'Computer Science', semester: 4, session: 'Fall 2024', cgpa: 3.85, status: 'active', enrollmentDate: new Date('2024-08-15'), email: 'fatima@icit.edu.pk', phone: '+92-300-4567890' },
      { id: '5', rollNo: 'SE-2024-023', name: 'Omar Riaz', program: 'BSSE', department: 'Software Engineering', semester: 4, session: 'Fall 2024', cgpa: 3.60, status: 'inactive', enrollmentDate: new Date('2024-08-17'), email: 'omar@icit.edu.pk', phone: '+92-300-3456789' },
      { id: '6', rollNo: 'IT-2024-005', name: 'Sara Khan', program: 'BSIT', department: 'Information Technology', semester: 4, session: 'Fall 2024', cgpa: 3.55, status: 'active', enrollmentDate: new Date('2024-08-15'), email: 'sara@icit.edu.pk', phone: '+92-300-2345678' },
      { id: '7', rollNo: 'AI-2024-012', name: 'Usman Chaudhry', program: 'BSAI', department: 'Artificial Intelligence', semester: 4, session: 'Fall 2024', cgpa: 3.40, status: 'active', enrollmentDate: new Date('2024-08-16'), email: 'usman@icit.edu.pk', phone: '+92-300-1234568' },
      { id: '8', rollNo: 'DS-2024-003', name: 'Ayesha Malik', program: 'BSDS', department: 'Data Science', semester: 4, session: 'Fall 2024', cgpa: 3.70, status: 'active', enrollmentDate: new Date('2024-08-15'), email: 'ayesha@icit.edu.pk', phone: '+92-300-8765432' }
    ];
  }

  loadChartData() {
    // Department wise distribution
    const deptMap = new Map<string, number>();
    this.students.forEach(s => {
      deptMap.set(s.department, (deptMap.get(s.department) || 0) + 1);
    });
    this.departmentWise = Array.from(deptMap.entries()).map(([dept, count]) => ({
      department: dept,
      count: count,
      percentage: (count / this.students.length) * 100
    }));

    // Program wise distribution
    const progMap = new Map<string, number>();
    this.students.forEach(s => {
      progMap.set(s.program, (progMap.get(s.program) || 0) + 1);
    });
    this.programWise = Array.from(progMap.entries()).map(([prog, count]) => ({
      program: prog,
      count: count,
      percentage: (count / this.students.length) * 100
    }));

    // Semester wise distribution
    const semMap = new Map<number, number>();
    this.students.forEach(s => {
      semMap.set(s.semester, (semMap.get(s.semester) || 0) + 1);
    });
    this.semesterWise = Array.from(semMap.entries()).map(([sem, count]) => ({
      semester: sem,
      count: count,
      percentage: (count / this.students.length) * 100
    })).sort((a, b) => a.semester - b.semester);

    // Session wise distribution
    const sessionMap = new Map<string, number>();
    this.students.forEach(s => {
      sessionMap.set(s.session, (sessionMap.get(s.session) || 0) + 1);
    });
    this.sessionWise = Array.from(sessionMap.entries()).map(([session, count]) => ({
      session: session,
      count: count,
      percentage: (count / this.students.length) * 100
    }));
  }

  applyFilters() {
    let filtered = [...this.students];
    
    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(term) ||
        s.rollNo.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term)
      );
    }
    
    // Program filter
    if (this.selectedProgram !== 'all') {
      filtered = filtered.filter(s => s.program === this.selectedProgram);
    }
    
    // Department filter
    if (this.selectedDepartment !== 'all') {
      filtered = filtered.filter(s => s.department === this.selectedDepartment);
    }
    
    // Semester filter
    if (this.selectedSemester !== 'all') {
      filtered = filtered.filter(s => s.semester === parseInt(this.selectedSemester));
    }
    
    // Session filter
    if (this.selectedSession !== 'all') {
      filtered = filtered.filter(s => s.session === this.selectedSession);
    }
    
    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === this.selectedStatus);
    }
    
    // Date range filter
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      filtered = filtered.filter(s => s.enrollmentDate >= start && s.enrollmentDate <= end);
    }
    
    this.filteredStudents = filtered;
    this.totalStudents = this.filteredStudents.length;
    this.currentPage = 1;
  }

  calculateStatistics() {
    this.totalActive = this.students.filter(s => s.status === 'active').length;
    this.totalGraduated = this.students.filter(s => s.status === 'graduated').length;
    this.totalSuspended = this.students.filter(s => s.status === 'suspended').length;
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedProgram = 'all';
    this.selectedDepartment = 'all';
    this.selectedSemester = 'all';
    this.selectedSession = 'all';
    this.selectedStatus = 'all';
    this.setDefaultDates();
    this.applyFilters();
  }

  get paginatedStudents(): StudentReport[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredStudents.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredStudents.length);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getAverageCGPA(): number {
    if (this.filteredStudents.length === 0) return 0;
    const sum = this.filteredStudents.reduce((acc, s) => acc + s.cgpa, 0);
    return sum / this.filteredStudents.length;
  }

  getTopPerformer(): StudentReport | null {
    if (this.filteredStudents.length === 0) return null;
    return this.filteredStudents.reduce((prev, current) => 
      (prev.cgpa > current.cgpa) ? prev : current
    );
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-amber-100 text-amber-700';
      case 'graduated': return 'bg-blue-100 text-blue-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'active': return 'fas fa-circle';
      case 'inactive': return 'fas fa-pause-circle';
      case 'graduated': return 'fas fa-graduation-cap';
      case 'suspended': return 'fas fa-ban';
      default: return 'fas fa-question-circle';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  exportToExcel() {
    this.showToast('info', 'Exporting to Excel...');
  }

  exportToPDF() {
    this.showToast('info', 'Exporting to PDF...');
  }

  printReport() {
    window.print();
  }

  showToast(type: string, message: string) {
    if (!this.isBrowser) return;
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-slide-up ${
      type === 'success' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
    }`;
    toast.innerHTML = `<div class="flex items-center gap-2"><i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i><span class="text-sm font-semibold">${message}</span></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}