import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: Date;
  transactionId?: string;
}

interface PaymentHistory {
  id: string;
  semester: string;
  amount: number;
  paymentDate: Date;
  method: 'bank_transfer' | 'credit_card' | 'cash' | 'online';
  transactionId: string;
  status: 'success' | 'pending' | 'failed';
}

@Component({
  selector: 'app-fee-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fee-records.html',
  styleUrls: ['./fee-records.css']
})
export class FeeRecords implements OnInit {
  Math = Math; // Add this line
  private isBrowser: boolean;
  
  studentName = 'Ahmed Sheikh';
  studentRollNo = 'CS-2024-001';
  totalPaid = 124500;
  totalPending = 52500;
  totalAmount = 177000;

  feeStructures: FeeStructure[] = [
    {
      id: '1',
      semester: 'Semester 1',
      year: 2024,
      tuitionFee: 45000,
      admissionFee: 10000,
      libraryFee: 2000,
      sportsFee: 1500,
      labFee: 3000,
      otherCharges: 1000,
      total: 62500,
      dueDate: new Date('2024-01-30'),
      status: 'paid',
      paidDate: new Date('2024-01-25'),
      transactionId: 'TXN-2024-001'
    },
    {
      id: '2',
      semester: 'Semester 2',
      year: 2025,
      tuitionFee: 45000,
      admissionFee: 0,
      libraryFee: 2000,
      sportsFee: 1500,
      labFee: 3000,
      otherCharges: 1000,
      total: 52500,
      dueDate: new Date('2025-02-15'),
      status: 'paid',
      paidDate: new Date('2025-02-10'),
      transactionId: 'TXN-2025-042'
    },
    {
      id: '3',
      semester: 'Semester 3',
      year: 2025,
      tuitionFee: 45000,
      admissionFee: 0,
      libraryFee: 2000,
      sportsFee: 1500,
      labFee: 3000,
      otherCharges: 1000,
      total: 52500,
      dueDate: new Date('2025-08-20'),
      status: 'paid',
      paidDate: new Date('2025-08-15'),
      transactionId: 'TXN-2025-089'
    },
    {
      id: '4',
      semester: 'Semester 4',
      year: 2026,
      tuitionFee: 45000,
      admissionFee: 0,
      libraryFee: 2000,
      sportsFee: 1500,
      labFee: 3000,
      otherCharges: 1000,
      total: 52500,
      dueDate: new Date('2026-05-15'),
      status: 'pending',
      paidDate: undefined,
      transactionId: undefined
    }
  ];

  paymentHistory: PaymentHistory[] = [
    {
      id: '1',
      semester: 'Semester 1',
      amount: 62500,
      paymentDate: new Date('2024-01-25'),
      method: 'bank_transfer',
      transactionId: 'TXN-2024-001',
      status: 'success'
    },
    {
      id: '2',
      semester: 'Semester 2',
      amount: 52500,
      paymentDate: new Date('2025-02-10'),
      method: 'credit_card',
      transactionId: 'TXN-2025-042',
      status: 'success'
    },
    {
      id: '3',
      semester: 'Semester 3',
      amount: 52500,
      paymentDate: new Date('2025-08-15'),
      method: 'online',
      transactionId: 'TXN-2025-089',
      status: 'success'
    }
  ];

  showFeeDetailsModal = false;
  showPaymentModal = false;
  selectedFee: FeeStructure | null = null;
  
  paymentMethod = 'bank_transfer';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';

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

  get paidFees(): FeeStructure[] {
    return this.feeStructures.filter(f => f.status === 'paid');
  }

  get pendingFees(): FeeStructure[] {
    return this.feeStructures.filter(f => f.status === 'pending' || f.status === 'overdue');
  }

  getTotalPaid(): number {
    return this.feeStructures
      .filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.total, 0);
  }

  getTotalPending(): number {
    return this.feeStructures
      .filter(f => f.status === 'pending' || f.status === 'overdue')
      .reduce((sum, f) => sum + f.total, 0);
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'paid': return 'status-paid';
      case 'pending': return 'status-pending';
      case 'overdue': return 'status-overdue';
      default: return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'paid': return 'fas fa-check-circle';
      case 'pending': return 'fas fa-clock';
      case 'overdue': return 'fas fa-exclamation-triangle';
      default: return 'fas fa-question-circle';
    }
  }

  getPaymentMethodIcon(method: string): string {
    switch(method) {
      case 'bank_transfer': return 'fas fa-university';
      case 'credit_card': return 'fab fa-cc-visa';
      case 'online': return 'fas fa-globe';
      case 'cash': return 'fas fa-money-bill';
      default: return 'fas fa-credit-card';
    }
  }

  getPaymentMethodLabel(method: string): string {
    switch(method) {
      case 'bank_transfer': return 'Bank Transfer';
      case 'credit_card': return 'Credit Card';
      case 'online': return 'Online Payment';
      case 'cash': return 'Cash';
      default: return method;
    }
  }

  getDaysRemaining(dueDate: Date): number {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
  }

  viewFeeDetails(fee: FeeStructure) {
    this.selectedFee = fee;
    this.showFeeDetailsModal = true;
  }

  closeFeeDetailsModal() {
    this.showFeeDetailsModal = false;
    this.selectedFee = null;
  }

  openPaymentModal(fee: FeeStructure) {
    this.selectedFee = fee;
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedFee = null;
    this.resetPaymentForm();
  }

  resetPaymentForm() {
    this.paymentMethod = 'bank_transfer';
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCvv = '';
  }

  processPayment() {
    if (!this.selectedFee) return;

    this.showToast('info', 'Processing payment...');
    
    setTimeout(() => {
      const payment: PaymentHistory = {
        id: (this.paymentHistory.length + 1).toString(),
        semester: this.selectedFee!.semester,
        amount: this.selectedFee!.total,
        paymentDate: new Date(),
        method: this.paymentMethod as any,
        transactionId: `TXN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        status: 'success'
      };
      
      this.paymentHistory.unshift(payment);
      
      const index = this.feeStructures.findIndex(f => f.id === this.selectedFee!.id);
      if (index !== -1) {
        this.feeStructures[index].status = 'paid';
        this.feeStructures[index].paidDate = new Date();
        this.feeStructures[index].transactionId = payment.transactionId;
      }
      
      this.showToast('success', `Payment of ${this.formatCurrency(this.selectedFee!.total)} completed successfully!`);
      this.closePaymentModal();
    }, 2000);
  }

  downloadReceipt(fee: FeeStructure) {
    if (!this.isBrowser) return;
    this.showToast('success', `Receipt for ${fee.semester} ${fee.year} is being downloaded`);
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