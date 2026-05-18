import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, UserData } from '../../../core/services/auth-services/auth.service';
import { ProfileService, UserProfile } from '../../../core/services/account-services/profile.service';

interface DashboardStat {
  label: string;
  value: number | string;
  change: number;
  icon: string;
  color: string;
  route: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  semester: number;
  program: string;
  enrolledStudents: number;
  schedule: string;
  room: string;
  progress: number;
}

interface PendingTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  count: number;
  route: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  type: 'class' | 'meeting' | 'deadline' | 'exam';
  description: string;
}

interface RecentActivity {
  id: string;
  action: string;
  courseName: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'warning';
}

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './faculty-dashboard.html',
  styleUrls: ['./faculty-dashboard.css']
})
export class FacultyDashboard implements OnInit, OnDestroy {
  Math = Math;
  
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private cdr = inject(ChangeDetectorRef);
  
  user: UserData | null = null;
  profile: UserProfile | null = null;
  currentTime = new Date();
  private timeInterval: any;

  stats: DashboardStat[] = [
    { label: 'Total Courses', value: '4', change: 0, icon: 'fas fa-book-open', color: 'purple', route: '/faculty/courses' },
    { label: 'Total Students', value: '156', change: 12, icon: 'fas fa-users', color: 'blue', route: '/faculty/courses' },
    { label: 'Pending Evaluations', value: '8', change: -2, icon: 'fas fa-project-diagram', color: 'amber', route: '/project-evaluation' },
    { label: 'Materials Uploaded', value: '24', change: 5, icon: 'fas fa-file-alt', color: 'emerald', route: '/faculty/materials' }
  ];

  currentCourses: Course[] = [
    { id: '1', code: 'CS401', name: 'Web Development', semester: 4, program: 'BSCS', enrolledStudents: 45, schedule: 'Mon & Wed, 10:00 AM - 11:30 AM', room: 'Lab-1', progress: 65 },
    { id: '2', code: 'CS402', name: 'Database Systems', semester: 4, program: 'BSCS', enrolledStudents: 42, schedule: 'Tue & Thu, 2:00 PM - 3:30 PM', room: 'Room 201', progress: 70 },
    { id: '3', code: 'CS403', name: 'Software Engineering', semester: 4, program: 'BSCS', enrolledStudents: 38, schedule: 'Mon & Wed, 2:00 PM - 3:30 PM', room: 'Room 105', progress: 60 },
    { id: '4', code: 'CS404', name: 'Final Year Project', semester: 4, program: 'BSCS', enrolledStudents: 31, schedule: 'Fri, 9:00 AM - 12:00 PM', room: 'Project Lab', progress: 45 }
  ];

  pendingTasks: PendingTask[] = [
    { id: '1', title: 'FYP Proposal Evaluation', description: 'Review submitted project proposals', priority: 'high', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), count: 12, route: '/project-evaluation' },
    { id: '2', title: 'Student Feedback', description: 'Provide performance feedback', priority: 'medium', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), count: 25, route: '/faculty/feedback' },
    { id: '3', title: 'Course Materials Upload', description: 'Upload lecture slides for Week 8', priority: 'low', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), count: 4, route: '/faculty/materials/upload' }
  ];

  upcomingEvents: UpcomingEvent[] = [
    { id: '1', title: 'Faculty Meeting', date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), type: 'meeting', description: 'Monthly faculty meeting in Conference Room' },
    { id: '2', title: 'Mid Term Exams', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), type: 'exam', description: 'Mid semester examinations begin' },
    { id: '3', title: 'FYP Proposal Deadline', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), type: 'deadline', description: 'Last date to submit FYP proposals' }
  ];

  recentActivities: RecentActivity[] = [
    { id: '1', action: 'Uploaded Course Material', courseName: 'Web Development - Week 7 Slides', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'success' },
    { id: '2', action: 'Evaluated Project', courseName: 'E-Learning Platform', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), status: 'success' },
    { id: '3', action: 'Submitted Student Feedback', courseName: 'Database Systems', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'success' },
    { id: '4', action: 'Updated Course Schedule', courseName: 'Software Engineering', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'pending' }
  ];

  quickActions = [
    { label: 'Evaluate Projects', icon: 'fas fa-clipboard-list', color: 'amber', route: '/project-evaluation', description: 'Review student projects' },
    { label: 'View Profile', icon: 'fas fa-user-circle', color: 'purple', route: '/profile', description: 'Manage your profile' }
  ];

  ngOnInit() {
    this.user = this.authService.getStoredUser();
    this.loadProfile();
    this.startClock();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data;
        this.cdr.detectChanges();
      }
    });
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

  getEventIcon(type: string): string {
    switch(type) {
      case 'class': return 'fas fa-chalkboard-teacher';
      case 'meeting': return 'fas fa-users';
      case 'deadline': return 'fas fa-hourglass-half';
      case 'exam': return 'fas fa-calendar-alt';
      default: return 'fas fa-bell';
    }
  }

  getEventColor(type: string): string {
    switch(type) {
      case 'class': return 'bg-blue-100 text-blue-600';
      case 'meeting': return 'bg-purple-100 text-purple-600';
      case 'deadline': return 'bg-amber-100 text-amber-600';
      case 'exam': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
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

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} day ago`;
  }

  getDaysRemaining(date: Date): number {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}