import { Component, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, UserData } from '../../../core/services/auth-services/auth.service';
import { ProfileService, UserProfile } from '../../../core/services/account-services/profile.service';


interface QuickStat {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
  route: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  type: 'fee' | 'exam' | 'fyp' | 'class';
  description: string;
}

interface RecentNotification {
  id: string;
  message: string;
  time: Date;
  isRead: boolean;
  type: 'info' | 'warning' | 'success';
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboard implements OnInit {

  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private cdr = inject(ChangeDetectorRef); 
  profile: UserProfile | null = null;
  currentTime = new Date();
private timeInterval: any;
  user: UserData | null = null;
  studentName = 'Ahmed Sheikh';
  studentRollNo = 'CS-2024-001';
  studentCGPA = 3.75;
  studentDepartment = 'Computer Science';
  currentSemester = 'Spring 2026';
  semesterProgress = 65;

  quickStats: QuickStat[] = [
    {
      label: 'Current CGPA',
      value: '3.75',
      change: 0.15,
      icon: 'fas fa-chart-line',
      color: 'emerald',
      route: '/semester-details'
    },
    {
      label: 'Pending Fee',
      value: 'PKR 25,500',
      change: -5000,
      icon: 'fas fa-credit-card',
      color: 'amber',
      route: '/fee-records'
    },
    {
      label: 'Subjects',
      value: '5',
      change: 0,
      icon: 'fas fa-book-open',
      color: 'blue',
      route: '/semester-details'
    },
    {
      label: 'Attendance',
      value: '85%',
      change: 5,
      icon: 'fas fa-calendar-check',
      color: 'purple',
      route: '/semester-details'
    }
  ];

  currentSubjects = [
    { code: 'CS401', name: 'Web Development', teacher: 'Dr. Sarah Ahmed', creditHours: 3, grade: 'A', attendance: 90 },
    { code: 'CS402', name: 'Database Systems', teacher: 'Prof. Michael Chen', creditHours: 3, grade: 'A-', attendance: 85 },
    { code: 'CS403', name: 'Software Engineering', teacher: 'Dr. Umar Farooq', creditHours: 3, grade: 'B+', attendance: 82 },
    { code: 'CS404', name: 'Computer Networks', teacher: 'Prof. Fatima Zafar', creditHours: 3, grade: 'A', attendance: 88 },
    { code: 'CS405', name: 'Final Year Project', teacher: 'Dr. Sarah Ahmed', creditHours: 3, grade: 'In Progress', attendance: 95 }
  ];

  upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'Fee Submission Deadline',
      date: new Date('2026-05-15'),
      type: 'fee',
      description: 'Last date to submit semester fee'
    },
    {
      id: '2',
      title: 'FYP Proposal Deadline',
      date: new Date('2026-04-30'),
      type: 'fyp',
      description: 'Submit your final year project proposal'
    },
    {
      id: '3',
      title: 'Mid Term Exams',
      date: new Date('2026-05-20'),
      type: 'exam',
      description: 'Mid semester examinations begin'
    },
    {
      id: '4',
      title: 'Web Development Quiz',
      date: new Date('2026-04-25'),
      type: 'class',
      description: 'Quiz #2 - Chapters 5-8'
    }
  ];

  recentNotifications: RecentNotification[] = [
    {
      id: '1',
      message: 'Fee deadline approaching on May 15, 2026',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      type: 'warning'
    },
    {
      id: '2',
      message: 'FYP proposal submission deadline extended to April 30',
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isRead: false,
      type: 'info'
    },
    {
      id: '3',
      message: 'Your CGPA has been updated to 3.75',
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isRead: true,
      type: 'success'
    }
  ];



ngOnInit() {
  this.user = this.authService.getStoredUser();
  if (this.user?.fullName) {
    this.studentName = this.user.fullName;
  }
  this.loadProfile();
}
startClock() {
  this.timeInterval = setInterval(() => {
    this.currentTime = new Date();
    this.cdr.detectChanges();
  }, 1000);
}

ngOnDestroy() {
  if (this.timeInterval) clearInterval(this.timeInterval);}

  
loadProfile() {
  this.profileService.getProfile().subscribe({
    next: (res) => {
      this.profile = res.data;
       this.cdr.detectChanges();
    }
  });
}

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  getDaysRemaining(date: Date): number {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
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

  getEventIcon(type: string): string {
    switch(type) {
      case 'fee': return 'fas fa-credit-card';
      case 'exam': return 'fas fa-calendar-alt';
      case 'fyp': return 'fas fa-project-diagram';
      case 'class': return 'fas fa-chalkboard-teacher';
      default: return 'fas fa-bell';
    }
  }

  getEventColor(type: string): string {
    switch(type) {
      case 'fee': return 'bg-amber-100 text-amber-600';
      case 'exam': return 'bg-red-100 text-red-600';
      case 'fyp': return 'bg-purple-100 text-purple-600';
      case 'class': return 'bg-blue-100 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  getGradeColor(grade: string): string {
    if (grade.includes('A')) return 'text-emerald-600';
    if (grade.includes('B')) return 'text-blue-600';
    if (grade.includes('C')) return 'text-amber-600';
    return 'text-slate-600';
  }

  getAttendanceColor(percentage: number): string {
    if (percentage >= 85) return 'bg-emerald-500';
    if (percentage >= 75) return 'bg-amber-500';
    return 'bg-red-500';
  }



}