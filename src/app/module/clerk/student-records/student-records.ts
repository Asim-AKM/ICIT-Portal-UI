import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  fatherName: string;
  cnic: string;
  email: string;
  phone: string;
  program: string;
  department: string;
  session: string;
  semester: number;
  cgpa: number;
  status: string;
  enrollmentDate: Date;
  address: string;
  city: string;
  guardianName: string;
  guardianPhone: string;
}

@Component({
  selector: 'app-student-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-records.html',
  styleUrls: ['./student-records.css']
})
export class StudentRecords implements OnInit {
  Math = Math;
  private isBrowser: boolean;
  
  // Search and Filters
  searchRegNo: string = '';
  searchName: string = '';
  selectedDepartment: string = 'all';
  selectedSemester: string = 'all';
  selectedProgram: string = 'all';
  selectedStatus: string = 'all';
  selectedSession: string = 'all';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  // Modal
  showStudentModal: boolean = false;
  selectedStudent: StudentRecord | null = null;
  isEditing: boolean = false;
  
  // Data
  students: StudentRecord[] = [];
  filteredStudents: StudentRecord[] = [];
  
  // Filter Options
  departments: string[] = ['Computer Science', 'Software Engineering', 'Information Technology', 'Artificial Intelligence', 'Data Science'];
  programs: string[] = ['BSCS', 'BSSE', 'BSIT', 'BSAI', 'BSDS'];
  sessions: string[] = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'];
  semesters: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  statuses: string[] = ['active', 'inactive', 'graduated', 'suspended'];
  
  // Statistics
  totalStudents: number = 0;
  activeStudents: number = 0;
  todayEnrollments: number = 0;
  thisMonthEnrollments: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadStudents();
    this.applyFilters();
    this.calculateStatistics();
  }

  loadStudents() {
    this.students = [
      {
        id: '1', rollNo: 'CS-2024-001', name: 'Ahmed Sheikh', fatherName: 'Mohammad Sheikh',
        cnic: '42101-1234567-8', email: 'ahmed@icit.edu.pk', phone: '+92-300-1234567',
        program: 'BSCS', department: 'Computer Science', session: 'Fall 2024', semester: 4,
        cgpa: 3.75, status: 'active', enrollmentDate: new Date('2024-08-15'),
        address: 'House #123, Gulshan-e-Iqbal', city: 'Karachi',
        guardianName: 'Mohammad Sheikh', guardianPhone: '+92-300-1234567'
      },
      {
        id: '2', rollNo: 'CS-2024-002', name: 'Kashif Farooq', fatherName: 'Farooq Ahmed',
        cnic: '42101-7654321-8', email: 'kashif@icit.edu.pk', phone: '+92-300-7654321',
        program: 'BSCS', department: 'Computer Science', session: 'Fall 2024', semester: 4,
        cgpa: 3.45, status: 'active', enrollmentDate: new Date('2024-08-15'),
        address: 'House #45, DHA', city: 'Karachi',
        guardianName: 'Farooq Ahmed', guardianPhone: '+92-300-7654321'
      },
      {
        id: '3', rollNo: 'SE-2024-015', name: 'Zain Ali', fatherName: 'Ali Raza',
        cnic: '42101-9876543-8', email: 'zain@icit.edu.pk', phone: '+92-300-9876543',
        program: 'BSSE', department: 'Software Engineering', session: 'Fall 2024', semester: 4,
        cgpa: 3.20, status: 'active', enrollmentDate: new Date('2024-08-16'),
        address: 'House #78, Clifton', city: 'Karachi',
        guardianName: 'Ali Raza', guardianPhone: '+92-300-9876543'
      },
      {
        id: '4', rollNo: 'CS-2024-008', name: 'Fatima Zahra', fatherName: 'Hassan Ahmed',
        cnic: '42101-4567890-8', email: 'fatima@icit.edu.pk', phone: '+92-300-4567890',
        program: 'BSCS', department: 'Computer Science', session: 'Fall 2024', semester: 4,
        cgpa: 3.85, status: 'active', enrollmentDate: new Date('2024-08-15'),
        address: 'House #12, Gulberg', city: 'Lahore',
        guardianName: 'Hassan Ahmed', guardianPhone: '+92-300-4567890'
      },
      {
        id: '5', rollNo: 'SE-2024-023', name: 'Omar Riaz', fatherName: 'Riaz Ahmed',
        cnic: '42101-3456789-8', email: 'omar@icit.edu.pk', phone: '+92-300-3456789',
        program: 'BSSE', department: 'Software Engineering', session: 'Fall 2024', semester: 4,
        cgpa: 3.60, status: 'inactive', enrollmentDate: new Date('2024-08-17'),
        address: 'House #56, Model Town', city: 'Lahore',
        guardianName: 'Riaz Ahmed', guardianPhone: '+92-300-3456789'
      }
    ];
  }

  applyFilters() {
    let filtered = [...this.students];
    
    // Filter by Registration Number
    if (this.searchRegNo) {
      filtered = filtered.filter(s => s.rollNo.toLowerCase().includes(this.searchRegNo.toLowerCase()));
    }
    
    // Filter by Name
    if (this.searchName) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(this.searchName.toLowerCase()));
    }
    
    // Filter by Department
    if (this.selectedDepartment !== 'all') {
      filtered = filtered.filter(s => s.department === this.selectedDepartment);
    }
    
    // Filter by Semester
    if (this.selectedSemester !== 'all') {
      filtered = filtered.filter(s => s.semester === parseInt(this.selectedSemester));
    }
    
    // Filter by Program
    if (this.selectedProgram !== 'all') {
      filtered = filtered.filter(s => s.program === this.selectedProgram);
    }
    
    // Filter by Status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === this.selectedStatus);
    }
    
    // Filter by Session
    if (this.selectedSession !== 'all') {
      filtered = filtered.filter(s => s.session === this.selectedSession);
    }
    
    this.filteredStudents = filtered;
    this.totalStudents = this.filteredStudents.length;
    this.currentPage = 1;
  }

  calculateStatistics() {
    this.activeStudents = this.students.filter(s => s.status === 'active').length;
    const today = new Date();
    this.todayEnrollments = this.students.filter(s => s.enrollmentDate.toDateString() === today.toDateString()).length;
    this.thisMonthEnrollments = this.students.filter(s => 
      s.enrollmentDate.getMonth() === today.getMonth() && 
      s.enrollmentDate.getFullYear() === today.getFullYear()
    ).length;
  }

  resetFilters() {
    this.searchRegNo = '';
    this.searchName = '';
    this.selectedDepartment = 'all';
    this.selectedSemester = 'all';
    this.selectedProgram = 'all';
    this.selectedStatus = 'all';
    this.selectedSession = 'all';
    this.applyFilters();
  }

  get paginatedStudents(): StudentRecord[] {
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

  viewStudent(student: StudentRecord) {
    this.selectedStudent = { ...student };
    this.isEditing = false;
    this.showStudentModal = true;
  }

  editStudent(student: StudentRecord) {
    this.selectedStudent = { ...student };
    this.isEditing = true;
    this.showStudentModal = true;
  }

  saveStudent() {
    if (this.selectedStudent) {
      const index = this.students.findIndex(s => s.id === this.selectedStudent!.id);
      if (index !== -1) {
        this.students[index] = { ...this.selectedStudent };
        this.showToast('success', 'Student record updated successfully!');
      }
      this.applyFilters();
      this.calculateStatistics();
    }
    this.closeModal();
  }

  deleteStudent(studentId: string) {
    if (confirm('Are you sure you want to delete this student record?')) {
      this.students = this.students.filter(s => s.id !== studentId);
      this.applyFilters();
      this.calculateStatistics();
      this.showToast('success', 'Student record deleted successfully!');
    }
  }

  closeModal() {
    this.showStudentModal = false;
    this.selectedStudent = null;
    this.isEditing = false;
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

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  showToast(type: string, message: string) {
    if (!this.isBrowser) return;
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-slide-up ${
      type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.innerHTML = `<div class="flex items-center gap-2"><i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span class="text-sm font-semibold">${message}</span></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}