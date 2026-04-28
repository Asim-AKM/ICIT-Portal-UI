import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Transaction {
  id: string;
  studentName: string;
  rollNo: string;
  amount: number;
  paymentDate: Date;
  method: string;
  semester: string;
  receiptNo: string;
}

interface DailyCollection {
  date: Date;
  totalAmount: number;
  transactionCount: number;
  cashAmount: number;
  bankTransferAmount: number;
  creditCardAmount: number;
  onlineAmount: number;
}

interface MonthlySummary {
  month: string;
  year: number;
  totalAmount: number;
  transactionCount: number;
  targetAmount: number;
}

interface PendingFee {
  rollNo: string;
  studentName: string;
  program: string;
  semester: number;
  amount: number;
  dueDate: Date;
  daysOverdue: number;
}

@Component({
  selector: 'app-fee-collection-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fee-collection-reports.html',
  styleUrls: ['./fee-collection-reports.css']
})
export class FeeCollectionReports implements OnInit {
  Math = Math;
  private isBrowser: boolean;
  
  // Active Tab
  activeTab: string = 'daily';
  
  // Date Range
  startDate: string = '';
  endDate: string = '';
  selectedMonth: string = '';
  selectedYear: number = new Date().getFullYear();
  
  // Filters
  selectedSemester: string = 'all';
  selectedProgram: string = 'all';
  
  // Data
  transactions: Transaction[] = [];
  dailyCollections: DailyCollection[] = [];
  monthlySummaries: MonthlySummary[] = [];
  pendingFees: PendingFee[] = [];
  filteredPendingFees: PendingFee[] = [];
  
  // Summary Stats
  todayCollection: number = 0;
  todayCount: number = 0;
  weekCollection: number = 0;
  monthCollection: number = 0;
  yearCollection: number = 0;
  pendingTotal: number = 0;
  
  // Available Years
  years: number[] = [2023, 2024, 2025, 2026];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  semesters: string[] = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  programs: string[] = ['BSCS', 'BSSE', 'BSIT', 'BSAI', 'BSDS'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.setDefaultDates();
  }

  ngOnInit() {
    this.loadData();
    this.calculateSummaryStats();
  }

  setDefaultDates() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.startDate = startOfMonth.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
    this.selectedMonth = this.months[today.getMonth()];
  }

  loadData() {
    this.loadTransactions();
    this.loadDailyCollections();
    this.loadMonthlySummaries();
    this.loadPendingFees();
  }

  loadTransactions() {
    this.transactions = [
      { id: '1', studentName: 'Ahmed Sheikh', rollNo: 'CS-2024-001', amount: 52500, paymentDate: new Date(), method: 'cash', semester: 'Semester 4', receiptNo: 'RCP-001' },
      { id: '2', studentName: 'Fatima Khan', rollNo: 'CS-2024-015', amount: 52500, paymentDate: new Date(), method: 'bank_transfer', semester: 'Semester 4', receiptNo: 'RCP-002' },
      { id: '3', studentName: 'Omar Riaz', rollNo: 'SE-2024-023', amount: 52500, paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), method: 'credit_card', semester: 'Semester 4', receiptNo: 'RCP-003' },
      { id: '4', studentName: 'Zain Ali', rollNo: 'CS-2024-002', amount: 52500, paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), method: 'online', semester: 'Semester 4', receiptNo: 'RCP-004' },
      { id: '5', studentName: 'Sara Khan', rollNo: 'CS-2024-008', amount: 52500, paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), method: 'cash', semester: 'Semester 4', receiptNo: 'RCP-005' }
    ];
  }

  loadDailyCollections() {
    const today = new Date();
    this.dailyCollections = [
      { date: new Date(), totalAmount: 105000, transactionCount: 2, cashAmount: 52500, bankTransferAmount: 52500, creditCardAmount: 0, onlineAmount: 0 },
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), totalAmount: 52500, transactionCount: 1, cashAmount: 0, bankTransferAmount: 0, creditCardAmount: 52500, onlineAmount: 0 },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), totalAmount: 0, transactionCount: 0, cashAmount: 0, bankTransferAmount: 0, creditCardAmount: 0, onlineAmount: 0 },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), totalAmount: 52500, transactionCount: 1, cashAmount: 0, bankTransferAmount: 0, creditCardAmount: 0, onlineAmount: 52500 },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), totalAmount: 0, transactionCount: 0, cashAmount: 0, bankTransferAmount: 0, creditCardAmount: 0, onlineAmount: 0 },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), totalAmount: 52500, transactionCount: 1, cashAmount: 52500, bankTransferAmount: 0, creditCardAmount: 0, onlineAmount: 0 }
    ];
  }

  loadMonthlySummaries() {
    this.monthlySummaries = [
      { month: 'January', year: 2024, totalAmount: 525000, transactionCount: 10, targetAmount: 500000 },
      { month: 'February', year: 2024, totalAmount: 630000, transactionCount: 12, targetAmount: 500000 },
      { month: 'March', year: 2024, totalAmount: 420000, transactionCount: 8, targetAmount: 500000 },
      { month: 'April', year: 2024, totalAmount: 735000, transactionCount: 14, targetAmount: 500000 },
      { month: 'May', year: 2024, totalAmount: 210000, transactionCount: 15, targetAmount: 500000 }
    ];
  }

  loadPendingFees() {
    this.pendingFees = [
      { rollNo: 'CS-2024-002', studentName: 'Kashif Farooq', program: 'BSCS', semester: 4, amount: 52500, dueDate: new Date('2026-05-15'), daysOverdue: 0 },
      { rollNo: 'CS-2024-003', studentName: 'Zain Ali', program: 'BSCS', semester: 4, amount: 52500, dueDate: new Date('2026-05-15'), daysOverdue: 0 },
      { rollNo: 'CS-2024-004', studentName: 'Sara Khan', program: 'BSCS', semester: 4, amount: 52500, dueDate: new Date('2026-05-15'), daysOverdue: 0 },
      { rollNo: 'SE-2024-005', studentName: 'Usman Chaudhry', program: 'BSSE', semester: 4, amount: 52500, dueDate: new Date('2026-05-10'), daysOverdue: 5 }
    ];
    this.applyPendingFilters();
  }

  applyPendingFilters() {
    let filtered = [...this.pendingFees];
    
    if (this.selectedSemester !== 'all') {
      filtered = filtered.filter(f => `Semester ${f.semester}` === this.selectedSemester);
    }
    
    if (this.selectedProgram !== 'all') {
      filtered = filtered.filter(f => f.program === this.selectedProgram);
    }
    
    this.filteredPendingFees = filtered;
    this.pendingTotal = this.filteredPendingFees.reduce((sum, f) => sum + f.amount, 0);
  }

  calculateSummaryStats() {
    const today = new Date();
    const todayStr = today.toDateString();
    
    this.todayCollection = this.transactions
      .filter(t => t.paymentDate.toDateString() === todayStr)
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.todayCount = this.transactions.filter(t => t.paymentDate.toDateString() === todayStr).length;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    this.weekCollection = this.transactions
      .filter(t => t.paymentDate >= weekAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.monthCollection = this.dailyCollections
      .filter(d => d.date.getMonth() === today.getMonth())
      .reduce((sum, d) => sum + d.totalAmount, 0);
    
    this.yearCollection = this.monthlySummaries
      .filter(m => m.year === today.getFullYear())
      .reduce((sum, m) => sum + m.totalAmount, 0);
  }

  getFilteredTransactions(): Transaction[] {
    let filtered = [...this.transactions];
    
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      filtered = filtered.filter(t => t.paymentDate >= start && t.paymentDate <= end);
    }
    
    return filtered.sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime());
  }

  getFilteredDailyCollections(): DailyCollection[] {
    let filtered = [...this.dailyCollections];
    
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      filtered = filtered.filter(d => d.date >= start && d.date <= end);
    }
    
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getSelectedMonthlyData(): MonthlySummary | undefined {
    return this.monthlySummaries.find(m => m.month === this.selectedMonth && m.year === this.selectedYear);
  }

  getTotalForPeriod(): number {
    return this.getFilteredTransactions().reduce((sum, t) => sum + t.amount, 0);
  }

  getMethodTotal(method: string): number {
    return this.getFilteredTransactions()
      .filter(t => t.method === method)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getMethodCount(method: string): number {
    return this.getFilteredTransactions().filter(t => t.method === method).length;
  }

  getMethodPercentage(method: string): number {
    const total = this.getTotalForPeriod();
    const methodTotal = this.getMethodTotal(method);
    return total > 0 ? (methodTotal / total) * 100 : 0;
  }

  getAchievementPercentage(achieved: number, target: number): number {
    return target > 0 ? (achieved / target) * 100 : 0;
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

  getStatusClass(daysOverdue: number): string {
    if (daysOverdue === 0) return 'text-amber-600 bg-amber-50';
    if (daysOverdue > 0 && daysOverdue <= 7) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
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