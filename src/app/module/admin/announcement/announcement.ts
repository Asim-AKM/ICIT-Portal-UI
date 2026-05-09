import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin-services/admin.service';
import { CreateAccountService, Department } from '../../../core/services/account-services/create-account-service';
import { SessionGetDto } from '../../../core/models/admin/session-get.dto';
import { ToastService } from '../../../core/services/toast-service/toast.service';
import { AnnouncementService,AnnouncementRequest } from '../../../core/services/announcement-services/announcement.service';
import { ConfirmDialogService } from '../../../core/services/generic-services/confirm-dialog.service';


interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'event' | 'info' | 'deadline';
  targetAudience: 'everyone' | 'faculty' | 'students' | 'clerk';
  createdAt: Date;
  views: number;
  sendEmail: boolean;
  isPublished: boolean;
}

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './announcement.html',
  styleUrl: './announcement.css',
})
export class Announcement implements OnInit {
  Math = Math;
  
  private adminService = inject(AdminService);
  private createAccountService = inject(CreateAccountService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  // Inject
private announcementService = inject(AnnouncementService);
private confirmDialog = inject(ConfirmDialogService);
  
  announcements: AnnouncementItem[] = [];
  showNewPostForm: boolean = false;
  isEditing: boolean = false;
  currentEditId: string | null = null;
  
  departments: Department[] = [];
  sessions: SessionGetDto[] = [];
  selectedDepartmentId: string = '';
  selectedSessionId: string = '';
  
  newAnnouncement: {
    title: string;
    message: string;
    type: 'urgent' | 'event' | 'info' | 'deadline';
    targetAudience: 'everyone' | 'faculty' | 'students' | 'clerk';
    sendEmail: boolean;
  } = {
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'everyone',
    sendEmail: false
  };

  audienceOptions: { value: 'everyone' | 'faculty' | 'students' | 'clerk'; label: string; icon: string; color: string }[] = [
    { value: 'everyone', label: 'Everyone', icon: 'fas fa-globe', color: 'emerald' },
    { value: 'faculty', label: 'Faculty Only', icon: 'fas fa-chalkboard-user', color: 'blue' },
    { value: 'students', label: 'Students Only', icon: 'fas fa-user-graduate', color: 'purple' },
    { value: 'clerk', label: 'Clerks Only', icon: 'fas fa-user-tie', color: 'amber' }
  ];

  typeOptions: { value: 'urgent' | 'event' | 'info' | 'deadline'; label: string; icon: string; color: string }[] = [
    { value: 'urgent', label: 'Urgent', icon: 'fas fa-exclamation-triangle', color: 'red' },
    { value: 'event', label: 'Event', icon: 'fas fa-calendar-alt', color: 'emerald' },
    { value: 'info', label: 'Information', icon: 'fas fa-info-circle', color: 'blue' },
    { value: 'deadline', label: 'Deadline', icon: 'fas fa-hourglass-half', color: 'amber' }
  ];

  ngOnInit() {
    this.loadAnnouncements();
    this.loadDepartments();
    this.loadSessions();
  }

  loadDepartments() {
    this.createAccountService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data;
        this.cdr.detectChanges();
      }
    });
  }

  loadSessions() {
    this.adminService.getSessionsByStatus(1).subscribe({
      next: (res) => {
        this.sessions = res.data;
        this.cdr.detectChanges();
      }
    });
  }

  loadAnnouncements() {
    this.announcements = [
      {
        id: '1',
        title: 'FYP Proposal Submission Deadline Extended',
        message: 'Due to technical maintenance on the portal, the deadline for 2026 Batch proposals has been moved to Friday, April 24th at 5:00 PM.',
        type: 'urgent',
        targetAudience: 'everyone',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        views: 1420,
        sendEmail: true,
        isPublished: true
      },
      {
        id: '2',
        title: 'ICIT Tech Expo 2026 Participation',
        message: 'Registration for the annual tech expo is now open. All clerks are requested to facilitate student project registrations at the main office.',
        type: 'event',
        targetAudience: 'everyone',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        views: 890,
        sendEmail: true,
        isPublished: true
      },
      {
        id: '3',
        title: 'Faculty Meeting - April 2026',
        message: 'Monthly faculty meeting scheduled for April 25th at 2:00 PM in Conference Room A. Attendance is mandatory.',
        type: 'deadline',
        targetAudience: 'faculty',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        views: 234,
        sendEmail: true,
        isPublished: true
      },
      {
        id: '4',
        title: 'Library Timing Changes',
        message: 'Library will remain open till 8:00 PM during exam week starting from May 1st.',
        type: 'info',
        targetAudience: 'students',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        views: 567,
        sendEmail: false,
        isPublished: true
      }
    ];
  }

  get showDepartmentDropdown(): boolean {
    return this.newAnnouncement.targetAudience === 'faculty' || 
           this.newAnnouncement.targetAudience === 'students' || 
           this.newAnnouncement.targetAudience === 'clerk';
  }

  get showSessionDropdown(): boolean {
    return this.newAnnouncement.targetAudience === 'students';
  }

  onAudienceChange() {
    this.selectedDepartmentId = '';
    this.selectedSessionId = '';
    this.cdr.detectChanges();
  }

  get filteredAnnouncements(): AnnouncementItem[] {
    return this.announcements.filter(a => a.isPublished).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  getTypeBadgeClass(type: string): string {
    switch(type) {
      case 'urgent': return 'bg-red-50 text-red-700 border-red-200';
      case 'event': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'deadline': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  }

  getTypeIcon(type: string): string {
    switch(type) {
      case 'urgent': return 'fas fa-exclamation-triangle';
      case 'event': return 'fas fa-calendar-alt';
      case 'info': return 'fas fa-info-circle';
      case 'deadline': return 'fas fa-hourglass-half';
      default: return 'fas fa-bullhorn';
    }
  }

  getAudienceBadgeClass(audience: string): string {
    switch(audience) {
      case 'everyone': return 'bg-emerald-50 text-emerald-700';
      case 'faculty': return 'bg-blue-50 text-blue-700';
      case 'students': return 'bg-purple-50 text-purple-700';
      case 'clerk': return 'bg-amber-50 text-amber-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  }

  getAudienceIcon(audience: string): string {
    switch(audience) {
      case 'everyone': return 'fas fa-globe';
      case 'faculty': return 'fas fa-chalkboard-user';
      case 'students': return 'fas fa-user-graduate';
      case 'clerk': return 'fas fa-user-tie';
      default: return 'fas fa-users';
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

  toggleNewPostForm() {
    this.showNewPostForm = !this.showNewPostForm;
    if (!this.showNewPostForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.isEditing = false;
    this.currentEditId = null;
    this.selectedDepartmentId = '';
    this.selectedSessionId = '';
    this.newAnnouncement = {
      title: '',
      message: '',
      type: 'info',
      targetAudience: 'everyone',
      sendEmail: false
    };
  }

  editAnnouncement(id: string) {
    const announcement = this.announcements.find(a => a.id === id);
    if (announcement) {
      this.isEditing = true;
      this.currentEditId = id;
      this.newAnnouncement = {
        title: announcement.title,
        message: announcement.message,
        type: announcement.type,
        targetAudience: announcement.targetAudience,
        sendEmail: announcement.sendEmail
      };
      this.showNewPostForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  deleteAnnouncement(id: string) {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcements = this.announcements.filter(a => a.id !== id);
      this.showToast('success', 'Announcement deleted successfully!');
    }
  }









// Update method
async publishAnnouncement() {
  if (!this.newAnnouncement.title.trim() || !this.newAnnouncement.message.trim()) {
    this.toast.error('Please fill in all required fields');
    return;
  }

  // Validate department if required
  if (this.showDepartmentDropdown && !this.selectedDepartmentId) {
    this.toast.error('Please select a department');
    return;
  }

  // Validate session if required
  if (this.showSessionDropdown && !this.selectedSessionId) {
    this.toast.error('Please select a session');
    return;
  }

  const confirmed = await this.confirmDialog.confirm({
    title: 'Publish Announcement?',
    message: `Are you sure you want to publish this announcement to <b>${this.getAudienceLabel(this.newAnnouncement.targetAudience)}</b>?`,
    confirmText: 'Yes, Publish',
    cancelText: 'Cancel',
    type: 'info',
    icon: 'fas fa-bullhorn'
  });

  if (!confirmed) return;

  const payload: AnnouncementRequest = {
    title: this.newAnnouncement.title,
    message: this.newAnnouncement.message,
    announcementType: this.getAnnouncementTypeNumber(this.newAnnouncement.type),
    announcementTargetAudience: this.getAudienceTypeNumber(this.newAnnouncement.targetAudience),
    departmentId: this.showDepartmentDropdown ? this.selectedDepartmentId : null,
    sessionId: this.showSessionDropdown ? this.selectedSessionId : null,
    sendMailNotification: this.newAnnouncement.sendEmail
  };

  this.announcementService.createAnnouncement(payload).subscribe({
    next: (res) => {
      this.toast.success(res.message || 'Announcement published successfully!');
      this.resetForm();
      this.showNewPostForm = false;
      this.loadAnnouncements();
    },
    error: (err) => {
      this.toast.error(err.error?.message || 'Failed to publish announcement');
    }
  });
}











  getAnnouncementTypeNumber(type: string): number {
    switch(type) {
      case 'urgent': return 1;
      case 'event': return 2;
      case 'info': return 3;
      case 'deadline': return 4;
      default: return 3;
    }
  }

  getAudienceTypeNumber(audience: string): number {
    switch(audience) {
      case 'everyone': return 1;
      case 'faculty': return 2;
      case 'students': return 3;
      case 'clerk': return 4;
      default: return 1;
    }
  }

  incrementViews(id: string) {
    const announcement = this.announcements.find(a => a.id === id);
    if (announcement) announcement.views++;
  }

  showToast(type: string, message: string) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-slide-up ${
      type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span class="text-sm font-semibold">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  getTypeLabel(type: string): string {
    const option = this.typeOptions.find(t => t.value === type);
    return option ? option.label : type;
  }

  getAudienceLabel(audience: string): string {
    const option = this.audienceOptions.find(a => a.value === audience);
    return option ? option.label : audience;
  }
}