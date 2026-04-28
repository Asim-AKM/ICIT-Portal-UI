import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

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
export class FacultyDashboard implements OnInit {
  Math = Math;
  private isBrowser: boolean;
  
  facultyName = 'Dr. Sarah Ahmed';
  facultyDepartment = 'Computer Science';
  currentTime = new Date();
  private timeInterval: any;

  stats: DashboardStat[] = [
    {
      label: 'Total Courses',
      value: '4',
      change: 0,
      icon: 'fas fa-book-open',
      color: 'purple',
      route: '/faculty/courses'
    },
    {
      label: 'Total Students',
      value: '156',
      change: 12,
      icon: 'fas fa-users',
      color: 'blue',
      route: '/faculty/courses'
    },
    {
      label: 'Pending Evaluations',
      value: '8',
      change: -2,
      icon: 'fas fa-project-diagram',
      color: 'amber',
      route: '/faculty/projects/pending'
    },
    {
      label: 'Materials Uploaded',
      value: '24',
      change: 5,
      icon: 'fas fa-file-alt',
      color: 'emerald',
      route: '/faculty/materials'
    }
  ];

  currentCourses: Course[] = [
    {
      id: '1',
      code: 'CS401',
      name: 'Web Development',
      semester: 4,
      program: 'BSCS',
      enrolledStudents: 45,
      schedule: 'Monday & Wednesday, 10:00 AM - 11:30 AM',
      room: 'Lab-1',
      progress: 65
    },
    {
      id: '2',
      code: 'CS402',
      name: 'Database Systems',
      semester: 4,
      program: 'BSCS',
      enrolledStudents: 42,
      schedule: 'Tuesday & Thursday, 2:00 PM - 3:30 PM',
      room: 'Room 201',
      progress: 70
    },
    {
      id: '3',
      code: 'CS403',
      name: 'Software Engineering',
      semester: 4,
      program: 'BSCS',
      enrolledStudents: 38,
      schedule: 'Monday & Wednesday, 2:00 PM - 3:30 PM',
      room: 'Room 105',
      progress: 60
    },
    {
      id: '4',
      code: 'CS404',
      name: 'Final Year Project',
      semester: 4,
      program: 'BSCS',
      enrolledStudents: 31,
      schedule: 'Friday, 9:00 AM - 12:00 PM',
      room: 'Project Lab',
      progress: 45
    }
  ];

  pendingTasks: PendingTask[] = [
    {
      id: '1',
      title: 'FYP Proposal Evaluation',
      description: 'Review and evaluate submitted project proposals',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      count: 12,
      route: '/faculty/projects/pending'
    },
    {
      id: '2',
      title: 'Student Feedback',
      description: 'Provide performance feedback for students',
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      count: 25,
      route: '/faculty/feedback'
    },
    {
      id: '3',
      title: 'Course Materials Upload',
      description: 'Upload lecture slides for Week 8',
      priority: 'low',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      count: 4,
      route: '/faculty/materials/upload'
    }
  ];

  upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'Faculty Meeting',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      type: 'meeting',
      description: 'Monthly faculty meeting in Conference Room'
    },
    {
      id: '2',
      title: 'Mid Term Exams',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      type: 'exam',
      description: 'Mid semester examinations begin'
    },
    {
      id: '3',
      title: 'FYP Proposal Deadline',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      type: 'deadline',
      description: 'Last date to submit final year project proposals'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      id: '1',
      action: 'Uploaded Course Material',
      courseName: 'Web Development - Week 7 Slides',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      id: '2',
      action: 'Evaluated Project',
      courseName: 'E-Learning Platform',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      id: '3',
      action: 'Submitted Student Feedback',
      courseName: 'Database Systems',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      id: '4',
      action: 'Updated Course Schedule',
      courseName: 'Software Engineering',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'pending'
    }
  ];

  quickActions = [
    { label: 'Upload Materials', icon: 'fas fa-upload', color: 'purple', route: '/faculty/materials/upload', description: 'Share lecture slides and notes' },
    { label: 'Evaluate Projects', icon: 'fas fa-clipboard-list', color: 'amber', route: '/faculty/projects/pending', description: 'Review student projects' },
    { label: 'Give Feedback', icon: 'fas fa-comment-dots', color: 'blue', route: '/faculty/feedback', description: 'Provide student remarks' },
    { label: 'View Schedule', icon: 'fas fa-calendar-alt', color: 'emerald', route: '/faculty/schedule', description: 'Check class timings' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const savedName = localStorage.getItem('facultyName');
      if (savedName) this.facultyName = savedName;
    }
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
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-default';
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
      case 'success': return 'status-success';
      case 'pending': return 'status-pending';
      case 'warning': return 'status-warning';
      default: return 'status-default';
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
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  getDaysRemaining(date: Date): number {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}