import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Student {
  id: string;
  rollNo: string;
  name: string;
  fatherName: string;
  program: string;
  semester: number;
  session: string;
  phone: string;
  email: string;
  cnic: string;
  address: string;
}

interface FeeStructure {
  id: string;
  semester: string;
  year: number;
  tuitionFee: number;
  admissionFee: number;
  libraryFee: number;
  sportsFee: number;
  labFee: number;
  otherCharges: number;
  total: number;
  dueDate: Date;
}

interface PaymentTransaction {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  amount: number;
  paymentDate: Date;
  method: string;
  transactionId: string;
  semester: string;
  status: string;
  receiptNo: string;
}

interface PendingPayment {
  rollNo: string;
  name: string;
  amount: number;
  semester: string;
  dueDate: Date;
}

@Component({
  selector: 'app-fee-collection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fee-collection.html',
  styleUrls: ['./fee-collection.css']
})
export class FeeCollection implements OnInit {
  private isBrowser: boolean;
  
  // Search
  searchRollNo: string = '';
  searchStudent: Student | null = null;
  isSearching: boolean = false;
  searchError: string = '';
  
  // Fee Structure
  selectedSemester: string = '';
  feeStructure: FeeStructure | null = null;
  
  // Payment
  paymentMethod: string = 'cash';
  transactionId: string = '';
  remarks: string = '';
  isProcessing: boolean = false;
  
  // Active Tab
  activeTab: string = 'collect';
  
  // Data
  pendingPayments: PendingPayment[] = [];
  transactions: PaymentTransaction[] = [];
  todaysCollection: number = 0;
  monthlyCollection: number = 0;
  
  // Dropdown options
  paymentMethods: string[] = ['cash', 'bank_transfer', 'credit_card', 'online'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadTransactions();
    this.loadPendingPayments();
    this.calculateCollections();
  }

  loadTransactions() {
    this.transactions = [
      {
        id: '1',
        studentId: '1',
        studentName: 'Ahmed Sheikh',
        rollNo: 'CS-2024-001',
        amount: 52500,
        paymentDate: new Date(),
        method: 'cash',
        transactionId: 'TXN-2024-001',
        semester: 'Semester 4',
        status: 'success',
        receiptNo: 'RCP-2024-001'
      },
      {
        id: '2',
        studentId: '2',
        studentName: 'Fatima Khan',
        rollNo: 'CS-2024-015',
        amount: 52500,
        paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        method: 'bank_transfer',
        transactionId: 'TXN-2024-002',
        semester: 'Semester 4',
        status: 'success',
        receiptNo: 'RCP-2024-002'
      }
    ];
  }

  loadPendingPayments() {
    this.pendingPayments = [
      { rollNo: 'CS-2024-002', name: 'Kashif Farooq', amount: 52500, semester: 'Semester 4', dueDate: new Date('2026-05-15') },
      { rollNo: 'CS-2024-003', name: 'Zain Ali', amount: 52500, semester: 'Semester 4', dueDate: new Date('2026-05-15') },
      { rollNo: 'CS-2024-004', name: 'Sara Khan', amount: 52500, semester: 'Semester 4', dueDate: new Date('2026-05-15') }
    ];
  }

  calculateCollections() {
    this.todaysCollection = this.transactions
      .filter(t => t.paymentDate.toDateString() === new Date().toDateString())
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.monthlyCollection = this.transactions
      .filter(t => t.paymentDate.getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0);
  }

  searchStudents() {
    if (!this.searchRollNo) {
      this.searchError = 'Please enter roll number';
      return;
    }
    
    this.isSearching = true;
    this.searchError = '';
    
    // Mock API call
    setTimeout(() => {
      if (this.searchRollNo === 'CS-2024-001') {
        this.searchStudent = {
          id: '1',
          rollNo: 'CS-2024-001',
          name: 'Ahmed Sheikh',
          fatherName: 'Mohammad Sheikh',
          program: 'BS Computer Science',
          semester: 4,
          session: 'Fall 2024',
          phone: '+92-300-1234567',
          email: 'ahmed@icit.edu.pk',
          cnic: '42101-1234567-8',
          address: 'Karachi, Pakistan'
        };
        this.loadFeeStructure();
      } else {
        this.searchError = 'Student not found';
        this.searchStudent = null;
        this.feeStructure = null;
      }
      this.isSearching = false;
    }, 500);
  }

  loadFeeStructure() {
    this.feeStructure = {
      id: '1',
      semester: 'Semester 4',
      year: 2026,
      tuitionFee: 45000,
      admissionFee: 0,
      libraryFee: 2000,
      sportsFee: 1500,
      labFee: 3000,
      otherCharges: 1000,
      total: 52500,
      dueDate: new Date('2026-05-15')
    };
  }

  setPaymentMethod(method: string) {
    this.paymentMethod = method;
  }

  getTotalFee(): number {
    return this.feeStructure ? this.feeStructure.total : 0;
  }

  processPayment() {
    if (!this.searchStudent) {
      this.searchError = 'Please search for a student first';
      return;
    }
    
    if (this.paymentMethod !== 'cash' && !this.transactionId) {
      this.showToast('error', 'Please enter transaction ID');
      return;
    }
    
    this.isProcessing = true;
    
    setTimeout(() => {
      const newTransaction: PaymentTransaction = {
        id: (this.transactions.length + 1).toString(),
        studentId: this.searchStudent!.id,
        studentName: this.searchStudent!.name,
        rollNo: this.searchStudent!.rollNo,
        amount: this.getTotalFee(),
        paymentDate: new Date(),
        method: this.paymentMethod,
        transactionId: this.paymentMethod === 'cash' ? `CASH-${Date.now()}` : this.transactionId,
        semester: this.feeStructure!.semester,
        status: 'success',
        receiptNo: `RCP-${Date.now()}`
      };
      
      this.transactions.unshift(newTransaction);
      this.calculateCollections();
      
      this.showToast('success', `Payment of PKR ${this.getTotalFee().toLocaleString()} received from ${this.searchStudent!.name}`);
      this.resetPaymentForm();
      this.isProcessing = false;
    }, 1500);
  }

  resetPaymentForm() {
    this.searchRollNo = '';
    this.searchStudent = null;
    this.feeStructure = null;
    this.paymentMethod = 'cash';
    this.transactionId = '';
    this.remarks = '';
    this.searchError = '';
  }

  printReceipt(transaction: PaymentTransaction) {
    this.showToast('info', `Printing receipt for ${transaction.receiptNo}`);
  }

  downloadReceipt(transaction: PaymentTransaction) {
    this.showToast('success', `Receipt ${transaction.receiptNo} downloaded`);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getMethodIcon(method: string): string {
    switch(method) {
      case 'cash': return 'fas fa-money-bill-wave';
      case 'bank_transfer': return 'fas fa-university';
      case 'credit_card': return 'fab fa-cc-visa';
      case 'online': return 'fas fa-mobile-alt';
      default: return 'fas fa-credit-card';
    }
  }

  getMethodLabel(method: string): string {
    switch(method) {
      case 'cash': return 'Cash';
      case 'bank_transfer': return 'Bank Transfer';
      case 'credit_card': return 'Credit Card';
      case 'online': return 'Online Payment';
      default: return method;
    }
  }

  getDaysRemaining(dueDate: Date): number {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
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
}