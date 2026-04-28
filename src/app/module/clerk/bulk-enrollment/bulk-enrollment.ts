import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';

interface BulkStudent {
  fullName: string;
  fatherName: string;
  cnic: string;
  email: string;
  phone: string;
  program: string;
  department: string;
  previousInstitute: string;
  previousPercentage: number;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
  rollNumber?: string;
}

@Component({
  selector: 'app-bulk-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-enrollment.html',
  styleUrls: ['./bulk-enrollment.css']
})
export class BulkEnrollment {
  private isBrowser: boolean;
  
  // Session Selection
  selectedSession = '';
  sessions = [
    { id: 'fall-2024', name: 'Fall Semester 2024', year: 2024, season: 'Fall' },
    { id: 'spring-2025', name: 'Spring Semester 2025', year: 2025, season: 'Spring' },
    { id: 'fall-2025', name: 'Fall Semester 2025', year: 2025, season: 'Fall' },
    { id: 'spring-2026', name: 'Spring Semester 2026', year: 2026, season: 'Spring' }
  ];
  
  // File upload
  selectedFile: File | null = null;
  fileName = '';
  isUploading = false;
  uploadProgress = 0;
  
  // Data
  bulkStudents: BulkStudent[] = [];
  showPreview = false;
  isProcessing = false;
  
  // Statistics
  totalRecords = 0;
  successCount = 0;
  errorCount = 0;
  
  // Template columns
  templateColumns = [
    'fullName', 'fatherName', 'cnic', 'email', 'phone',
    'program', 'department', 'previousInstitute', 'previousPercentage'
  ];

  programs = ['BSCS', 'BSSE', 'BSIT', 'BSAI', 'BSDS'];
  departments = ['Computer Science', 'Software Engineering', 'Information Technology', 'Artificial Intelligence', 'Data Science'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getSessionName(): string {
    const session = this.sessions.find(s => s.id === this.selectedSession);
    return session ? `${session.name}` : 'Not Selected';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      this.previewExcel(file);
    }
  }

  previewExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      this.bulkStudents = jsonData.map((row: any) => ({
        fullName: row['fullName'] || row['Full Name'] || '',
        fatherName: row['fatherName'] || row['Father Name'] || '',
        cnic: row['cnic'] || row['CNIC'] || '',
        email: row['email'] || row['Email'] || '',
        phone: row['phone'] || row['Phone'] || '',
        program: row['program'] || row['Program'] || '',
        department: row['department'] || row['Department'] || '',
        previousInstitute: row['previousInstitute'] || row['Previous Institute'] || '',
        previousPercentage: row['previousPercentage'] || row['Percentage'] || 0,
        status: 'pending',
        errorMessage: ''
      }));
      
      this.totalRecords = this.bulkStudents.length;
      this.showPreview = true;
    };
    reader.readAsArrayBuffer(file);
  }

  downloadTemplate() {
    const templateData = [{
      fullName: 'John Doe',
      fatherName: 'Robert Doe',
      cnic: '42101-1234567-8',
      email: 'john.doe@example.com',
      phone: '+92-300-1234567',
      program: 'BSCS',
      department: 'Computer Science',
      previousInstitute: 'Govt College',
      previousPercentage: 85.5
    }];
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student Template');
    
    ws['!cols'] = [
      { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 25 },
      { wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 25 }, { wch: 15 }
    ];
    
    const sessionName = this.getSessionName().replace(/\s/g, '_');
    XLSX.writeFile(wb, `student_enrollment_${sessionName}.xlsx`);
    this.showToast('info', 'Template downloaded successfully');
  }

  validateStudent(student: BulkStudent, index: number): boolean {
    if (!student.fullName) {
      student.errorMessage = 'Full Name is required';
      return false;
    }
    if (!student.fatherName) {
      student.errorMessage = 'Father Name is required';
      return false;
    }
    if (!student.cnic) {
      student.errorMessage = 'CNIC is required';
      return false;
    }
    if (!student.email) {
      student.errorMessage = 'Email is required';
      return false;
    }
    if (!student.phone) {
      student.errorMessage = 'Phone number is required';
      return false;
    }
    if (!student.program) {
      student.errorMessage = 'Program is required';
      return false;
    }
    if (!student.department) {
      student.errorMessage = 'Department is required';
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email)) {
      student.errorMessage = 'Invalid email format';
      return false;
    }
    
    const cnicRegex = /^\d{5}-\d{7}-\d$/;
    if (!cnicRegex.test(student.cnic)) {
      student.errorMessage = 'Invalid CNIC format (use: 42101-1234567-8)';
      return false;
    }
    
    const phoneRegex = /^\+92-\d{3}-\d{7}$/;
    if (!phoneRegex.test(student.phone)) {
      student.errorMessage = 'Invalid phone format (use: +92-300-1234567)';
      return false;
    }
    
    student.errorMessage = '';
    return true;
  }

  removeStudent(index: number) {
    this.bulkStudents.splice(index, 1);
    this.totalRecords = this.bulkStudents.length;
    this.updateCounts();
  }

  updateCounts() {
    this.successCount = this.bulkStudents.filter(s => s.status === 'success').length;
    this.errorCount = this.bulkStudents.filter(s => s.status === 'error').length;
  }

  processBulkUpload() {
    if (!this.selectedSession) {
      this.showToast('error', 'Please select a session first');
      return;
    }
    
    this.isProcessing = true;
    this.uploadProgress = 0;
    
    let hasErrors = false;
    this.bulkStudents.forEach((student, index) => {
      if (!this.validateStudent(student, index)) {
        student.status = 'error';
        hasErrors = true;
      } else {
        student.status = 'pending';
      }
    });
    
    if (hasErrors) {
      this.showToast('error', 'Please fix errors in the data before proceeding');
      this.isProcessing = false;
      this.updateCounts();
      return;
    }
    
    let processed = 0;
    const interval = setInterval(() => {
      if (processed < this.bulkStudents.length) {
        const student = this.bulkStudents[processed];
        const session = this.sessions.find(s => s.id === this.selectedSession);
        const year = session?.year || new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const prefix = student.program === 'BSCS' ? 'CS' : 
                       student.program === 'BSSE' ? 'SE' : 
                       student.program === 'BSIT' ? 'IT' : 'ST';
        student.rollNumber = `${prefix}-${year}-${random}`;
        student.status = 'success';
        
        processed++;
        this.uploadProgress = Math.floor((processed / this.bulkStudents.length) * 100);
        this.updateCounts();
      } else {
        clearInterval(interval);
        this.isProcessing = false;
        
        if (this.isBrowser) {
          const existing = localStorage.getItem('enrolledStudents');
          const students = existing ? JSON.parse(existing) : [];
          this.bulkStudents.forEach(s => {
            if (s.status === 'success') {
              students.push({
                fullName: s.fullName,
                fatherName: s.fatherName,
                cnic: s.cnic,
                email: s.email,
                phone: s.phone,
                program: s.program,
                department: s.department,
                session: this.getSessionName(),
                rollNumber: s.rollNumber,
                enrollmentDate: new Date()
              });
            }
          });
          localStorage.setItem('enrolledStudents', JSON.stringify(students));
        }
        
        this.showToast('success', `${this.successCount} students enrolled successfully for ${this.getSessionName()}!`);
      }
    }, 500);
  }

  resetUpload() {
    this.selectedFile = null;
    this.fileName = '';
    this.bulkStudents = [];
    this.showPreview = false;
    this.totalRecords = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.uploadProgress = 0;
    this.isProcessing = false;
    
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  resetAll() {
    this.selectedSession = '';
    this.resetUpload();
  }

  showToast(type: string, message: string) {
    if (!this.isBrowser) return;
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-slide-up ${
      type === 'success' ? 'bg-emerald-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`;
    toast.innerHTML = `<div class="flex items-center gap-2"><i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i><span class="text-sm font-semibold">${message}</span></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'success': return 'bg-emerald-100 text-emerald-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      default: return 'fas fa-clock';
    }
  }

  proceedToUpload() {
    if (!this.selectedSession) {
      this.showToast('error', 'Please select a session first');
      return;
    }
    // Scroll to file upload section
    document.getElementById('uploadSection')?.scrollIntoView({ behavior: 'smooth' });
  }
}