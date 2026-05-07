import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin-services/admin.service';
import { ClerkService } from '../../../core/services/clerk-service/clerk.service';
import { CreateAccountService, Department } from '../../../core/services/account-services/create-account-service';
import { SessionGetDto } from '../../../core/models/admin/session-get.dto';
import { ToastService } from '../../../core/services/toast-service/toast.service';
import * as XLSX from 'xlsx';

interface BulkStudent {
  name: string;
  email: string;
  rollNo: string;
  regNo: string;
  cnic: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

@Component({
  selector: 'app-bulk-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-enrollment.html',
  styleUrls: ['./bulk-enrollment.css']
})
export class BulkEnrollment implements OnInit {
  
  private adminService = inject(AdminService);
  private clerkService = inject(ClerkService);
  private createAccountService = inject(CreateAccountService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  
  // Session Selection
  selectedSession = '';
  sessions: SessionGetDto[] = [];
  isLoadingSessions = false;
  
  // Department Selection
  selectedDepartmentId = '';
  departments: Department[] = [];
  isLoadingDepartments = false;
  
  // File upload
  selectedFile: File | null = null;
  fileName = '';
  uploadProgress = 0;
  
  // Data
  bulkStudents: BulkStudent[] = [];
  showPreview = false;
  isProcessing = false;
  
  // Statistics
  totalRecords = 0;
  successCount = 0;
  errorCount = 0;

  ngOnInit() {
    this.loadSessions();
    this.loadDepartments();
  }

  loadSessions() {
    this.isLoadingSessions = true;
    this.cdr.detectChanges();
    
    this.adminService.getSessionsByStatus(1).subscribe({
      next: (res) => {
        this.sessions = res.data;
        this.isLoadingSessions = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingSessions = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load sessions');
      }
    });
  }

  loadDepartments() {
    this.isLoadingDepartments = true;
    this.cdr.detectChanges();
    
    this.createAccountService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data;
        this.isLoadingDepartments = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingDepartments = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load departments');
      }
    });
  }

  getSessionName(): string {
    const session = this.sessions.find(s => s.sessionId === this.selectedSession);
    return session ? session.name : 'Not Selected';
  }

  getDepartmentName(): string {
    const dept = this.departments.find(d => d.departmentId === this.selectedDepartmentId);
    return dept ? dept.name : 'Not Selected';
  }

  proceedToUpload() {
    if (!this.selectedSession) {
      this.toast.error('Please select a session first');
      return;
    }
    if (!this.selectedDepartmentId) {
      this.toast.error('Please select a department first');
      return;
    }
    document.getElementById('uploadSection')?.scrollIntoView({ behavior: 'smooth' });
  }

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    this.fileName = file.name;
    // ❌ Preview yahan mat dikhao
    this.toast.success('File selected: ' + file.name);
  }
}

previewAndProceed() {
  window.scroll(0,0);
  if (!this.selectedFile) {
    this.toast.error('Please select a file first');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    
    this.bulkStudents = jsonData.map((row: any) => ({
      name: row['Name'] || row['name'] || '',
      email: row['Email'] || row['email'] || '',
      rollNo: row['Roll No'] || row['rollNo'] || row['Roll'] || '',
      regNo: row['Reg No'] || row['regNo'] || row['Registration No'] || '',
      cnic: row['CNIC'] || row['cnic'] || '',
      status: 'pending' as const,
      errorMessage: ''
    }));
    
    this.totalRecords = this.bulkStudents.length;
    this.successCount = 0;
    this.errorCount = 0;
    this.showPreview = true;
    this.cdr.detectChanges();
  };
  reader.readAsArrayBuffer(this.selectedFile);
}


  downloadTemplate() {
    const templateData = [
      { Name: 'Asim Khan', Email: 'asimkhanmiani9@gmail.com', 'Roll No': '52239', 'Reg No': 'REG2024001', CNIC: '12201-2837277-9' },
      { Name: '', Email: '', 'Roll No': '', 'Reg No': '', CNIC: '' },
      { Name: '', Email: '', 'Roll No': '', 'Reg No': '', CNIC: '' },
      { Name: '', Email: '', 'Roll No': '', 'Reg No': '', CNIC: '' },
      { Name: '', Email: '', 'Roll No': '', 'Reg No': '', CNIC: '' }
    ];
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student Enrollment');
    
    ws['!cols'] = [
      { wch: 25 }, { wch: 35 }, { wch: 12 }, { wch: 15 }, { wch: 18 }
    ];
    
    XLSX.writeFile(wb, 'Student_Enrollment_Template.xlsx');
    this.toast.success('Template downloaded! Fill the data and upload.');
  }

  removeStudent(index: number) {
    this.bulkStudents.splice(index, 1);
    this.totalRecords = this.bulkStudents.length;
    this.updateCounts();
    this.cdr.detectChanges();
  }

  updateCounts() {
    this.successCount = this.bulkStudents.filter(s => s.status === 'success').length;
    this.errorCount = this.bulkStudents.filter(s => s.status === 'error').length;
  }

  processBulkUpload() {
    if (!this.selectedSession) {
      this.toast.error('Please select a session first');
      return;
    }
    if (!this.selectedDepartmentId) {
      this.toast.error('Please select a department first');
      return;
    }
    if (!this.selectedFile) {
      this.toast.error('Please select an Excel file');
      return;
    }
    if (this.bulkStudents.length === 0) {
      this.toast.error('No students to upload');
      return;
    }

    this.isProcessing = true;
    this.uploadProgress = 0;
    this.cdr.detectChanges();

    this.clerkService.uploadBulkStudents(
      this.selectedSession,
      this.selectedDepartmentId,
      this.selectedFile
    ).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.uploadProgress = 100;
        this.successCount = this.bulkStudents.length;
        this.errorCount = 0;
        this.bulkStudents.forEach(s => s.status = 'success');
        this.updateCounts();
        this.cdr.detectChanges();
        this.toast.success(res.message || 'Students uploaded successfully!');
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorCount = this.bulkStudents.length;
        this.successCount = 0;
        this.bulkStudents.forEach(s => {
          s.status = 'error';
          s.errorMessage = err.error?.message || 'Upload failed';
        });
        this.updateCounts();
        this.cdr.detectChanges();
        this.toast.error(err.error?.message || 'Failed to upload students');
      }
    });
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
    this.cdr.detectChanges();

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  resetAll() {
    this.selectedSession = '';
    this.selectedDepartmentId = '';
    this.resetUpload();
    this.cdr.detectChanges();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'success': return 'bg-emerald-100 text-emerald-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      default: return 'fas fa-clock';
    }
  }
}