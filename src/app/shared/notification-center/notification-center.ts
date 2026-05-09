import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NotificationService,NotificationItem } from '../../core/services/notification-servces/notification.service';
import { ToastService } from '../../core/services/toast-service/toast.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './notification-center.html',
  styleUrl: './notification-center.css',
})
export class NotificationCenter implements OnInit {
  Math = Math;
  
  private notificationService = inject(NotificationService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  selectedFilter: string = 'all';
  statusFilter: string = 'all';
  searchTerm: string = '';
  isLoading = false;
  
  notifications: NotificationItem[] = [];
  
  notificationTypes = [
    { value: 'all', label: 'All', icon: 'fas fa-bell', color: 'slate' },
    { value: 'Fee', label: 'Fee', icon: 'fas fa-credit-card', color: 'emerald' },
    { value: 'Exam', label: 'Exam', icon: 'fas fa-calendar-alt', color: 'amber' },
    { value: 'FYP', label: 'FYP', icon: 'fas fa-project-diagram', color: 'purple' },
    { value: 'Announcement', label: 'Announcement', icon: 'fas fa-bullhorn', color: 'blue' }
  ];

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;
    this.notificationService.getRecentNotifications().subscribe({
      next: (res) => {
        this.notifications = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load notifications');
      }
    });
  }

  get filteredNotifications(): NotificationItem[] {
    let filtered = [...this.notifications];
    
    // Filter by type
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(n => n.notificationType === this.selectedFilter);
    }
    
    // Filter by status
    if (this.statusFilter === 'read') {
      filtered = filtered.filter(n => n.isRead === true);
    } else if (this.statusFilter === 'unread') {
      filtered = filtered.filter(n => n.isRead === false);
    }
    
    // Search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(term) || 
        n.message.toLowerCase().includes(term)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getTypeIcon(type: string, announcementType?: string | null): string {
    if (type === 'Announcement' && announcementType) {
      switch(announcementType) {
        case 'Urgent': return 'fas fa-exclamation-triangle';
        case 'Event': return 'fas fa-calendar-alt';
        case 'Information': return 'fas fa-info-circle';
        case 'Deadline': return 'fas fa-hourglass-half';
      }
    }
    switch(type) {
      case 'Fee': return 'fas fa-credit-card';
      case 'Exam': return 'fas fa-file-alt';
      case 'FYP': return 'fas fa-project-diagram';
      case 'Announcement': return 'fas fa-bullhorn';
      default: return 'fas fa-bell';
    }
  }

  getTypeColor(type: string, announcementType?: string | null): string {
    if (type === 'Announcement' && announcementType) {
      switch(announcementType) {
        case 'Urgent': return 'bg-red-100 text-red-600';
        case 'Event': return 'bg-emerald-100 text-emerald-600';
        case 'Information': return 'bg-blue-100 text-blue-600';
        case 'Deadline': return 'bg-amber-100 text-amber-600';
      }
    }
    switch(type) {
      case 'Fee': return 'bg-emerald-100 text-emerald-600';
      case 'Exam': return 'bg-amber-100 text-amber-600';
      case 'FYP': return 'bg-purple-100 text-purple-600';
      case 'Announcement': return 'bg-blue-100 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  formatTimeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  markAsRead(notification: NotificationItem) {
    if (notification.isRead) return;
    
    this.notificationService.markAsRead(notification.notificationId).subscribe({
      next: () => {
        notification.isRead = true;
        this.cdr.detectChanges();
      }
    });
  }

  markAllAsRead() {
    this.notifications.forEach(n => {
      if (!n.isRead) {
        this.notificationService.markAsRead(n.notificationId).subscribe();
        n.isRead = true;
      }
    });
    this.cdr.detectChanges();
    this.toast.success('All notifications marked as read');
  }

  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.notificationId !== notificationId);
    this.cdr.detectChanges();
    this.toast.success('Notification deleted');
  }

  deleteAllRead() {
    this.notifications = this.notifications.filter(n => !n.isRead);
    this.cdr.detectChanges();
    this.toast.success('Read notifications cleared');
  }

  getTypeCount(type: string): number {
    if (type === 'all') return this.notifications.length;
    return this.notifications.filter(n => n.notificationType === type).length;
  }

  openNotification(notification: NotificationItem) {
    this.markAsRead(notification);
    if (notification.actionUrl) {
      this.router.navigateByUrl(notification.actionUrl);
    }
  }
}