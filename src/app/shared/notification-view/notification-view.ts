import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService,NotificationItem } from '../../core/services/notification-servces/notification.service';
import { ToastService } from '../../core/services/toast-service/toast.service';

@Component({
  selector: 'app-notification-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification-view.html',
  styleUrl: './notification-view.css',
})
export class NotificationView implements OnInit {
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  
  notification: NotificationItem | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    this.loadNotification();
  }

  loadNotification() {
    const notificationId = this.route.snapshot.paramMap.get('id');
    if (!notificationId) {
      this.errorMessage = 'Notification ID not found';
      this.isLoading = false;
      return;
    }

    // Mark as read immediately
    this.notificationService.markAsRead(notificationId).subscribe();

    // Load notification from recent list (or call single notification API if available)
    this.notificationService.getRecentNotifications().subscribe({
      next: (res) => {
        const found = res.data.find(n => n.notificationId === notificationId);
        if (found) {
          this.notification = found;
          this.isLoading = false;
          this.cdr.detectChanges();
        } else {
          this.errorMessage = 'Notification not found';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load notification';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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
        case 'Urgent': return 'from-red-500 to-red-600';
        case 'Event': return 'from-emerald-500 to-emerald-600';
        case 'Information': return 'from-blue-500 to-blue-600';
        case 'Deadline': return 'from-amber-500 to-amber-600';
      }
    }
    switch(type) {
      case 'Fee': return 'from-emerald-500 to-emerald-600';
      case 'Exam': return 'from-amber-500 to-amber-600';
      case 'FYP': return 'from-purple-500 to-purple-600';
      case 'Announcement': return 'from-blue-500 to-blue-600';
      default: return 'from-slate-500 to-slate-600';
    }
  }

  getTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  getAnnouncementTypeLabel(type: string | null): string {
    if (!type) return '';
    return type;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack() {
    window.history.back();
  }




  getTypeBadgeClass(type: string, announcementType?: string | null): string {
  if (type === 'Announcement' && announcementType) {
    switch(announcementType) {
      case 'Urgent': return 'bg-red-50 text-red-700 border border-red-200';
      case 'Event': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Information': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Deadline': return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
  }
  switch(type) {
    case 'Fee': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'Exam': return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'FYP': return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'Announcement': return 'bg-blue-50 text-blue-700 border border-blue-200';
    default: return 'bg-slate-50 text-slate-700 border border-slate-200';
  }
}

getAnnouncementBadgeClass(type: string): string {
  switch(type) {
    case 'Urgent': return 'bg-red-50 text-red-700 border border-red-200';
    case 'Event': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'Information': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'Deadline': return 'bg-amber-50 text-amber-700 border border-amber-200';
    default: return 'bg-slate-50 text-slate-700 border border-slate-200';
  }
}

getAnnouncementIcon(type: string): string {
  switch(type) {
    case 'Urgent': return 'fas fa-exclamation-triangle';
    case 'Event': return 'fas fa-calendar-alt';
    case 'Information': return 'fas fa-info-circle';
    case 'Deadline': return 'fas fa-hourglass-half';
    default: return 'fas fa-bullhorn';
  }
}

getSenderInitials(name: string): string {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length >= 2) {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
}