import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Student {
  id: string;
  rollNo: string;
  name: string;
  fatherName: string;
  program: string;
  department: string;
  semester: number;
  session: string;
  email: string;
  phone: string;
}

interface FeeType {
  id: string;
  name: string;
  amount: number;
  isOptional: boolean;
}

interface Challan {
  id: string;
  challanNo: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  semester: number;
  feeItems: FeeItem[];
  totalAmount: number;
  dueDate: Date;
  generatedDate: Date;
  status: 'pending' | 'paid' | 'expired';
}

interface FeeItem {
  name: string;
  amount: number;
}

@Component({
  selector: 'app-generate-challan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate-challan.html',
  styleUrls: ['./generate-challan.css']
})
export class GenerateChallan {
  private isBrowser: boolean;
  
  // Search
  searchRollNo: string = '';
  searchStudent: Student | null = null;
  isSearching: boolean = false;
  searchError: string = '';
  
  // Fee Selection
  selectedSemester: number = 4;
  dueDate: string = '';
  discountAmount: number = 0;
  discountReason: string = '';
  lateFeePenalty: number = 0;
  
  // Fee Items
  feeItems: FeeItem[] = [];
  
  // Fee Structure
  feeStructure = {
    tuitionFee: 45000,
    admissionFee: 0,
    libraryFee: 2000,
    sportsFee: 1500,
    labFee: 3000,
    examinationFee: 2500,
    lateFee: 0
  };
  
  // Optional Fees
  optionalFees = [
    { name: 'Hostel Fee', amount: 25000, selected: false },
    { name: 'Transportation Fee', amount: 15000, selected: false },
    { name: 'Medical Insurance', amount: 2000, selected: false }
  ];
  
  // Generated Challan
  generatedChallan: Challan | null = null;
  showChallanPreview: boolean = false;
  isGenerating: boolean = false;
  
  // Semesters
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  
  // Bank Details
  bankDetails = {
    bankName: 'National Bank of Pakistan',
    accountTitle: 'ICIT Fee Collection Account',
    accountNo: '1234-567890-123',
    branchCode: '0123',
    branchAddress: 'Main Campus Branch, University Road, Karachi'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.setDefaultDueDate();
  }

  setDefaultDueDate() {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    this.dueDate = date.toISOString().split('T')[0];
  }

  searchStudents() {
    if (!this.searchRollNo) {
      this.searchError = 'Please enter roll number';
      return;
    }
    
    this.isSearching = true;
    this.searchError = '';
    
    setTimeout(() => {
      if (this.searchRollNo === 'CS-2024-001') {
        this.searchStudent = {
          id: '1',
          rollNo: 'CS-2024-001',
          name: 'Ahmed Sheikh',
          fatherName: 'Mohammad Sheikh',
          program: 'BSCS',
          department: 'Computer Science',
          semester: 4,
          session: 'Fall 2024',
          email: 'ahmed@icit.edu.pk',
          phone: '+92-300-1234567'
        };
        this.loadFeeItems();
      } else {
        this.searchError = 'Student not found';
        this.searchStudent = null;
        this.feeItems = [];
      }
      this.isSearching = false;
    }, 500);
  }

  loadFeeItems() {
    this.feeItems = [
      { name: 'Tuition Fee', amount: this.feeStructure.tuitionFee },
      { name: 'Library Fee', amount: this.feeStructure.libraryFee },
      { name: 'Sports Fee', amount: this.feeStructure.sportsFee },
      { name: 'Lab Fee', amount: this.feeStructure.labFee },
      { name: 'Examination Fee', amount: this.feeStructure.examinationFee }
    ];
    
    if (this.feeStructure.admissionFee > 0) {
      this.feeItems.unshift({ name: 'Admission Fee', amount: this.feeStructure.admissionFee });
    }
  }

  toggleOptionalFee(index: number) {
    this.optionalFees[index].selected = !this.optionalFees[index].selected;
    this.updateFeeItems();
  }

  updateFeeItems() {
    this.feeItems = [
      { name: 'Tuition Fee', amount: this.feeStructure.tuitionFee },
      { name: 'Library Fee', amount: this.feeStructure.libraryFee },
      { name: 'Sports Fee', amount: this.feeStructure.sportsFee },
      { name: 'Lab Fee', amount: this.feeStructure.labFee },
      { name: 'Examination Fee', amount: this.feeStructure.examinationFee }
    ];
    
    this.optionalFees.forEach(fee => {
      if (fee.selected) {
        this.feeItems.push({ name: fee.name, amount: fee.amount });
      }
    });
    
    if (this.lateFeePenalty > 0) {
      this.feeItems.push({ name: 'Late Fee Penalty', amount: this.lateFeePenalty });
    }
  }

  updateLateFee() {
    this.updateFeeItems();
  }

  getSubtotal(): number {
    return this.feeItems.reduce((sum, item) => sum + item.amount, 0);
  }

  getTotalAmount(): number {
    let total = this.getSubtotal();
    total -= this.discountAmount;
    return total > 0 ? total : 0;
  }

  generateChallan() {
    if (!this.searchStudent) {
      this.searchError = 'Please search for a student first';
      return;
    }
    
    this.isGenerating = true;
    
    setTimeout(() => {
      const challanNo = `CHL-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      this.generatedChallan = {
        id: Date.now().toString(),
        challanNo: challanNo,
        studentId: this.searchStudent!.id,
        studentName: this.searchStudent!.name,
        rollNo: this.searchStudent!.rollNo,
        semester: this.selectedSemester,
        feeItems: [...this.feeItems],
        totalAmount: this.getTotalAmount(),
        dueDate: new Date(this.dueDate),
        generatedDate: new Date(),
        status: 'pending'
      };
      
      this.showChallanPreview = true;
      this.isGenerating = false;
      
      // Save to localStorage
      if (this.isBrowser) {
        const existing = localStorage.getItem('generatedChallans');
        const challans = existing ? JSON.parse(existing) : [];
        challans.push(this.generatedChallan);
        localStorage.setItem('generatedChallans', JSON.stringify(challans));
      }
      
      this.showToast('success', 'Challan generated successfully!');
    }, 1000);
  }

  printChallan() {
    if (!this.isBrowser) return;
    const printContent = document.getElementById('challanPreview');
    const WindowPrt = window.open('', '', 'width=900,height=700');
    if (WindowPrt) {
      WindowPrt.document.write('<html><head><title>Fee Challan</title>');
      WindowPrt.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">');
      WindowPrt.document.write('<style>');
      WindowPrt.document.write(`
        body { font-family: Arial, sans-serif; padding: 40px; }
        .challan-container { max-width: 800px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; }
        .subtitle { font-size: 14px; color: #666; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .info-label { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #000; padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total-row { font-weight: bold; background-color: #f9f9f9; }
        .bank-details { margin-top: 30px; padding: 15px; border: 1px solid #ccc; background-color: #f9f9f9; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        @media print { body { margin: 0; padding: 0; } .no-print { display: none; } }
      `);
      WindowPrt.document.write('</style></head><body>');
      WindowPrt.document.write(printContent?.innerHTML || '');
      WindowPrt.document.write('</body></html>');
      WindowPrt.document.close();
      WindowPrt.print();
      WindowPrt.close();
    }
  }

  downloadChallan() {
    this.printChallan();
  }

  resetForm() {
    this.searchRollNo = '';
    this.searchStudent = null;
    this.searchError = '';
    this.feeItems = [];
    this.optionalFees.forEach(f => f.selected = false);
    this.discountAmount = 0;
    this.discountReason = '';
    this.lateFeePenalty = 0;
    this.selectedSemester = 4;
    this.setDefaultDueDate();
    this.showChallanPreview = false;
    this.generatedChallan = null;
  }

  newChallan() {
    this.resetForm();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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