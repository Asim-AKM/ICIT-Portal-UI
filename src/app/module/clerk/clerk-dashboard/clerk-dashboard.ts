import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, UserData } from '../../../core/services/auth-services/auth.service';

interface DashboardStat {
  label: string;
  value: number | string;
  change: number;
  icon: string;
  color: string;
  route: string;
}

interface PendingTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  deadline: Date;
  count: number;
  route: string;
}

interface RecentActivity {
  id: string;
  action: string;
  studentName: string;
  studentRollNo: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'warning';
}

interface TodayTarget {
  label: string;
  achieved: number;
  target: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-clerk-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clerk-dashboard.html',
  styleUrls: ['./clerk-dashboard.css']
})
export class ClerkDashboard implements OnInit, OnDestroy {
  Math = Math;
  
  private authService = inject(AuthService);
  
  user: UserData | null = null;
  currentTime = new Date();
  private timeInterval: any;

  stats: DashboardStat[] = [
    {
      label: 'Total Students',
      value: '2,481',
      change: 12.5,
      icon: 'fas fa-users',
      color: 'blue',
      route: '/student-records'
    },
    {
      label: 'Pending Enrollments',
      value: '24',
      change: -5,
      icon: 'fas fa-user-graduate',
      color: 'emerald',
      route: '/single-enrollment'
    },
    {
      label: 'Fee Collection Today',
      value: '₨ 125,000',
      change: 8.3,
      icon: 'fas fa-credit-card',
      color: 'amber',
      route: '/fee-collection'
    },
    {
      label: 'Documents Pending',
      value: '42',
      change: -10,
      icon: 'fas fa-file-alt',
      color: 'purple',
      route: '/student-records'
    }
  ];

  pendingTasks: PendingTask[] = [
    {
      id: '1',
      title: 'Student Enrollment Applications',
      description: 'New student enrollment requests awaiting approval',
      priority: 'high',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      count: 24,
      route: '/single-enrollment'
    },
    {
      id: '2',
      title: 'Document Verification',
      description: 'Student documents pending verification',
      priority: 'high',
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      count: 42,
      route: '/student-records'
    },
    {
      id: '3',
      title: 'Fee Collection',
      description: 'Pending fee payments for current semester',
      priority: 'medium',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      count: 156,
      route: '/fee-collection'
    },
    {
      id: '4',
      title: 'Monthly Reports Generation',
      description: 'Generate and submit monthly enrollment reports',
      priority: 'low',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      count: 1,
      route: '/student-reports'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      id: '1',
      action: 'Student Enrolled',
      studentName: 'Ahmed Sheikh',
      studentRollNo: 'CS-2024-001',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      id: '2',
      action: 'Fee Payment Received',
      studentName: 'Fatima Khan',
      studentRollNo: 'CS-2024-015',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      id: '3',
      action: 'Documents Verified',
      studentName: 'Omar Riaz',
      studentRollNo: 'SE-2024-023',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      id: '4',
      action: 'Enrollment Pending',
      studentName: 'Zara Malik',
      studentRollNo: 'CS-2024-089',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'pending'
    },
    {
      id: '5',
      action: 'Fee Late Payment',
      studentName: 'Usman Chaudhry',
      studentRollNo: 'CS-2024-056',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'warning'
    }
  ];

  todayTargets: TodayTarget[] = [
    { label: 'Enrollments', achieved: 18, target: 30, icon: 'fas fa-user-graduate', color: 'blue' },
    { label: 'Fee Collection', achieved: 125000, target: 200000, icon: 'fas fa-credit-card', color: 'emerald' },
    { label: 'Verifications', achieved: 28, target: 50, icon: 'fas fa-file-alt', color: 'purple' },
    { label: 'Reports', achieved: 2, target: 5, icon: 'fas fa-chart-bar', color: 'amber' }
  ];

  quickActions = [
    { label: 'New Enrollment', icon: 'fas fa-user-plus', color: 'blue', route: '/single-enrollment', description: 'Register new student' },
    { label: 'Bulk Upload', icon: 'fas fa-upload', color: 'emerald', route: '/bulk-enrollment', description: 'Upload Excel file' },
    { label: 'Collect Fee', icon: 'fas fa-hand-holding-usd', color: 'purple', route: '/fee-collection', description: 'Process fee payment' },
    { label: 'Generate Report', icon: 'fas fa-file-excel', color: 'amber', route: '/student-reports', description: 'Create reports' }
  ];

  ngOnInit() {
    this.user = this.authService.getStoredUser();
    this.startClock();
  }

  ngOnDestroy() {
    if (this.timeInterval) clearInterval(this.timeInterval);
  }

  startClock() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  getGreeting(): string {
    const hour = this.currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  getFormattedDate(): string {
    return this.currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  }

  getPriorityIcon(priority: string): string {
    switch(priority) {
      case 'high': return 'fas fa-exclamation-circle';
      case 'medium': return 'fas fa-chart-line';
      case 'low': return 'fas fa-info-circle';
      default: return 'fas fa-circle';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'success': return 'bg-emerald-100 text-emerald-600';
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'warning': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'success': return 'fas fa-check-circle';
      case 'pending': return 'fas fa-clock';
      case 'warning': return 'fas fa-exclamation-triangle';
      default: return 'fas fa-circle';
    }
  }

  getDaysRemaining(deadline: Date): number {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} day ago`;
  }

  formatCurrency(amount: number): string {
    return '₨ ' + amount.toLocaleString('en-PK');
  }

  getTargetPercentage(achieved: number, target: number): number {
    return Math.min((achieved / target) * 100, 100);
  }
}