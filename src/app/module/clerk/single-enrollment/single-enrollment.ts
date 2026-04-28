import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface StudentData {
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  cnic: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  postalCode: string;
  
  // Academic Information
  program: string;
  department: string;
  semester: number;
  session: string;
  rollNumber: string;
  registrationDate: string;
  
  // Previous Education
  previousInstitute: string;
  previousDegree: string;
  percentage: number;
  yearOfPassing: number;
  
  // Guardian Information
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  
  // Documents
  cnicCopy: boolean;
  domicile: boolean;
  previousDegreeCert: boolean;
  transcript: boolean;
  passportPhoto: boolean;
}

@Component({
  selector: 'app-single-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-enrollment.html',
  styleUrls: ['./single-enrollment.css']
})
export class SingleEnrollment implements OnInit {
  private isBrowser: boolean;
  
  activeTab: 'personal' | 'academic' | 'education' | 'guardian' | 'documents' = 'personal';
  isSubmitting = false;
  enrollmentSuccess = false;
  generatedRollNumber = '';
  
  student: StudentData = {
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    cnic: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    postalCode: '',
    program: '',
    department: '',
    semester: 1,
    session: '',
    rollNumber: '',
    registrationDate: new Date().toISOString().split('T')[0],
    previousInstitute: '',
    previousDegree: '',
    percentage: 0,
    yearOfPassing: 0,
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    guardianEmail: '',
    cnicCopy: false,
    domicile: false,
    previousDegreeCert: false,
    transcript: false,
    passportPhoto: false
  };

  programs = [
    { value: 'BSCS', label: 'BS Computer Science' },
    { value: 'BSSE', label: 'BS Software Engineering' },
    { value: 'BSIT', label: 'BS Information Technology' },
    { value: 'BSAI', label: 'BS Artificial Intelligence' },
    { value: 'BSDS', label: 'BS Data Science' }
  ];

  departments = [
    'Computer Science',
    'Software Engineering',
    'Information Technology',
    'Artificial Intelligence',
    'Data Science'
  ];

  semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  sessions = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'];
  genders = ['Male', 'Female', 'Other'];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  relations = ['Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Other'];
  cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Multan', 'Faisalabad', 'Peshawar', 'Quetta'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.generateRollNumberPrefix();
  }

  generateRollNumberPrefix() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.student.rollNumber = `STU-${year}-${random}`;
  }

  generateRollNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.student.rollNumber = `STU-${year}-${random}`;
  }

  nextTab() {
    switch(this.activeTab) {
      case 'personal':
        if (this.validatePersonal()) this.activeTab = 'academic';
        break;
      case 'academic':
        if (this.validateAcademic()) this.activeTab = 'education';
        break;
      case 'education':
        if (this.validateEducation()) this.activeTab = 'guardian';
        break;
      case 'guardian':
        if (this.validateGuardian()) this.activeTab = 'documents';
        break;
    }
  }

  previousTab() {
    switch(this.activeTab) {
      case 'academic': this.activeTab = 'personal'; break;
      case 'education': this.activeTab = 'academic'; break;
      case 'guardian': this.activeTab = 'education'; break;
      case 'documents': this.activeTab = 'guardian'; break;
    }
  }

  validatePersonal(): boolean {
    if (!this.student.fullName) { this.showToast('error', 'Please enter full name'); return false; }
    if (!this.student.fatherName) { this.showToast('error', 'Please enter father name'); return false; }
    if (!this.student.cnic) { this.showToast('error', 'Please enter CNIC'); return false; }
    if (!this.student.email) { this.showToast('error', 'Please enter email'); return false; }
    if (!this.student.phone) { this.showToast('error', 'Please enter phone number'); return false; }
    if (!this.student.address) { this.showToast('error', 'Please enter address'); return false; }
    return true;
  }

  validateAcademic(): boolean {
    if (!this.student.program) { this.showToast('error', 'Please select program'); return false; }
    if (!this.student.department) { this.showToast('error', 'Please select department'); return false; }
    if (!this.student.session) { this.showToast('error', 'Please select session'); return false; }
    return true;
  }

  validateEducation(): boolean {
    if (!this.student.previousInstitute) { this.showToast('error', 'Please enter previous institute'); return false; }
    if (!this.student.previousDegree) { this.showToast('error', 'Please enter previous degree'); return false; }
    if (!this.student.percentage) { this.showToast('error', 'Please enter percentage'); return false; }
    return true;
  }

  validateGuardian(): boolean {
    if (!this.student.guardianName) { this.showToast('error', 'Please enter guardian name'); return false; }
    if (!this.student.guardianPhone) { this.showToast('error', 'Please enter guardian phone'); return false; }
    return true;
  }

  submitEnrollment() {
    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.enrollmentSuccess = true;
      
      // Save to localStorage for demo
      if (this.isBrowser) {
        const existing = localStorage.getItem('enrolledStudents');
        const students = existing ? JSON.parse(existing) : [];
        students.push({ ...this.student, enrollmentDate: new Date() });
        localStorage.setItem('enrolledStudents', JSON.stringify(students));
      }
      
      this.showToast('success', `Student ${this.student.fullName} enrolled successfully! Roll Number: ${this.student.rollNumber}`);
    }, 2000);
  }

  resetForm() {
    this.student = {
      fullName: '',
      fatherName: '',
      motherName: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      cnic: '',
      email: '',
      phone: '',
      alternatePhone: '',
      address: '',
      city: '',
      postalCode: '',
      program: '',
      department: '',
      semester: 1,
      session: '',
      rollNumber: '',
      registrationDate: new Date().toISOString().split('T')[0],
      previousInstitute: '',
      previousDegree: '',
      percentage: 0,
      yearOfPassing: 0,
      guardianName: '',
      guardianRelation: '',
      guardianPhone: '',
      guardianEmail: '',
      cnicCopy: false,
      domicile: false,
      previousDegreeCert: false,
      transcript: false,
      passportPhoto: false
    };
    this.generateRollNumber();
    this.activeTab = 'personal';
    this.enrollmentSuccess = false;
  }

  newEnrollment() {
    this.resetForm();
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

  getTabClass(tab: string): string {
    if (this.activeTab === tab) {
      return 'bg-blue-600 text-white shadow-md';
    }
    if (this.isTabCompleted(tab)) {
      return 'bg-green-100 text-green-700 border-green-300';
    }
    return 'bg-slate-100 text-slate-600 hover:bg-slate-200';
  }

  isTabCompleted(tab: string): boolean {
    switch(tab) {
      case 'personal':
        return !!this.student.fullName && !!this.student.cnic;
      case 'academic':
        return !!this.student.program && !!this.student.department;
      case 'education':
        return !!this.student.previousInstitute;
      case 'guardian':
        return !!this.student.guardianName;
      case 'documents':
        return this.student.cnicCopy || this.student.domicile;
      default:
        return false;
    }
  }
}