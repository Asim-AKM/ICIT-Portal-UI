import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'fee' | 'exam' | 'fyp' | 'announcement' | 'deadline' | 'result';
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationFilter {
  type: string;
  status: string;
}

@Component({
  selector: 'app-student-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-notifications.html',
  styleUrls: ['./student-notifications.css']
})
export class StudentNotifications implements OnInit {
  Math = Math;
  private isBrowser: boolean;
  
  selectedFilter: string = 'all';
  statusFilter: string = 'all';
  searchTerm: string = '';
  
  notifications: Notification[] = [];
  
  notificationTypes = [
    { value: 'all', label: 'All', icon: 'fas fa-bell', color: 'slate' },
    { value: 'fee', label: 'Fee', icon: 'fas fa-credit-card', color: 'emerald' },
    { value: 'exam', label: 'Exam', icon: 'fas fa-calendar-alt', color: 'red' },
    { value: 'fyp', label: 'FYP', icon: 'fas fa-project-diagram', color: 'purple' },
    { value: 'deadline', label: 'Deadline', icon: 'fas fa-hourglass-half', color: 'amber' },
    { value: 'announcement', label: 'Announcement', icon: 'fas fa-bullhorn', color: 'blue' },
    { value: 'result', label: 'Result', icon: 'fas fa-chart-line', color: 'emerald' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    // Mock data - replace with API call
    this.notifications = [
      {
        id: '1',
        title: 'Fee Deadline Reminder',
        message: 'Last date to submit semester fee for Spring 2026 is May 15, 2026. Late fee of PKR 5,000 will be charged after deadline.',
        type: 'fee',
        priority: 'high',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actionUrl: '/student/fee',
        actionLabel: 'Pay Now'
      },
      {
        id: '2',
        title: 'Mid Term Exam Schedule',
        message: 'Mid term examinations will commence from May 20, 2026. Check your exam schedule on the portal.',
        type: 'exam',
        priority: 'high',
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        actionUrl: '/student/exams',
        actionLabel: 'View Schedule'
      },
      {
        id: '3',
        title: 'FYP Proposal Submission',
        message: 'Last date to submit FYP proposal is April 30, 2026. Make sure to submit before the deadline.',
        type: 'fyp',
        priority: 'high',
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        actionUrl: '/student/fyp',
        actionLabel: 'Submit Proposal'
      },
      {
        id: '4',
        title: 'University Holiday Announcement',
        message: 'University will remain closed on May 1st on account of Labor Day.',
        type: 'announcement',
        priority: 'medium',
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actionLabel: 'Dismiss'
      },
      {
        id: '5',
        title: 'Scholarship Application Deadline',
        message: 'Last date to apply for merit scholarship is May 10, 2026. Eligible students are encouraged to apply.',
        type: 'deadline',
        priority: 'medium',
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        actionUrl: '/student/scholarship',
        actionLabel: 'Apply Now'
      },
      {
        id: '6',
        title: 'Semester Result Announced',
        message: 'Results for Semester 3 have been announced. Check your transcript for details.',
        type: 'result',
        priority: 'high',
        isRead: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        actionUrl: '/student/transcript',
        actionLabel: 'View Result'
      },
      {
        id: '7',
        title: 'Web Development Workshop',
        message: 'A free workshop on Modern Web Development will be held on May 5th. Register before May 3rd.',
        type: 'announcement',
        priority: 'low',
        isRead: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        actionUrl: '/student/workshop',
        actionLabel: 'Register'
      },
      {
        id: '8',
        title: 'Library Book Return Deadline',
        message: 'Please return all library books borrowed in Semester 3 by May 15, 2026 to avoid fine.',
        type: 'deadline',
        priority: 'medium',
        isRead: true,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        actionLabel: 'Dismiss'
      }
    ];
  }

  get filteredNotifications(): Notification[] {
    let filtered = [...this.notifications];
    
    // Filter by type
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(n => n.type === this.selectedFilter);
    }
    
    // Filter by status (read/unread)
    if (this.statusFilter === 'read') {
      filtered = filtered.filter(n => n.isRead === true);
    } else if (this.statusFilter === 'unread') {
      filtered = filtered.filter(n => n.isRead === false);
    }
    
    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(term) || 
        n.message.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getTypeIcon(type: string): string {
    switch(type) {
      case 'fee': return 'fas fa-credit-card';
      case 'exam': return 'fas fa-calendar-alt';
      case 'fyp': return 'fas fa-project-diagram';
      case 'deadline': return 'fas fa-hourglass-half';
      case 'announcement': return 'fas fa-bullhorn';
      case 'result': return 'fas fa-chart-line';
      default: return 'fas fa-bell';
    }
  }

  getTypeColor(type: string): string {
    switch(type) {
      case 'fee': return 'emerald';
      case 'exam': return 'red';
      case 'fyp': return 'purple';
      case 'deadline': return 'amber';
      case 'announcement': return 'blue';
      case 'result': return 'emerald';
      default: return 'slate';
    }
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

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      this.showToast('success', 'Notification marked as read');
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => {
      if (!n.isRead) {
        n.isRead = true;
      }
    });
    this.showToast('success', 'All notifications marked as read');
  }

  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.showToast('success', 'Notification deleted');
  }

  deleteAllRead() {
    this.notifications = this.notifications.filter(n => !n.isRead);
    this.showToast('success', 'All read notifications deleted');
  }

  getTypeCount(type: string): number {
    if (type === 'all') {
      return this.notifications.length;
    }
    return this.notifications.filter(n => n.type === type).length;
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