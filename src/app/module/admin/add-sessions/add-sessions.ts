import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { SessionAddDto } from '../../../core/models/admin/session-add.dto';
import { SessionGetDto } from '../../../core/models/admin/session-get.dto';
import { SessionStatusEnum } from '../../../core/models/enums/session-status.enum';

interface Session {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'completed';
  createdAt: Date;
  enrollmentCount: number;
  description: string;
}

@Component({
  selector: 'app-add-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-sessions.html',
  styleUrl: './add-sessions.css',
})
export class AddSessions implements OnInit {
  Math = Math;
  
  sessions: Session[] = [];
  filteredSessions: Session[] = [];
  
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  selectedSession: Session | null = null;
  
  // Store original status for revert on error
  originalStatus: string = '';
  
  searchTerm: string = '';
  statusFilter: string = 'all';
  
  // Loading states
  isLoading: boolean = false;
  isCreating: boolean = false;
  isUpdating: boolean = false;
  
  // Form model for new session
  newSession = {
    title: '',
    startDate: '',
    endDate: '',
    description: ''
  };
  
  // Status options
  statusOptions = [
    { value: 'active', label: 'Active', color: 'emerald', icon: 'fas fa-play-circle' },
    { value: 'inactive', label: 'Inactive', color: 'amber', icon: 'fas fa-pause-circle' },
    { value: 'completed', label: 'Completed', color: 'blue', icon: 'fas fa-check-circle' }
  ];

 constructor(
  private adminService: AdminService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit() {
    this.loadSessions();
  }

  // ============================================================
  // LOAD SESSIONS FROM API BASED ON SELECTED FILTER
  // ============================================================
  loadSessions() {
    this.isLoading = true;
    
    let statusParam: SessionStatusEnum | undefined = undefined;
    
    switch (this.statusFilter) {
      case 'active':
        statusParam = SessionStatusEnum.Active;
        break;
      case 'inactive':
        statusParam = SessionStatusEnum.Inactive;
        break;
      case 'completed':
        statusParam = SessionStatusEnum.Completed;
        break;
      default:
        statusParam = undefined;
        break;
    }
    
    const apiCall = statusParam !== undefined
      ? this.adminService.getSessionsByStatus(statusParam)
      : this.adminService.getSessions();
    
    apiCall.subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.sessions = response.data.map((apiSession: SessionGetDto) => ({
            id: apiSession.sessionId,
            title: apiSession.name,
            startDate: new Date(apiSession.startYear),
            endDate: new Date(apiSession.endYear),
            status: this.mapApiStatus(apiSession.status),
            createdAt: new Date(),
            enrollmentCount: 0,
            description: apiSession.name
          }));
          this.applySearchFilter();
            // ✅ Force change detection
        this.cdr.detectChanges();
        } else {
          if (response.status === 404) {
            this.sessions = [];
            this.filteredSessions = [];
            this.showToast('info', response.message || 'No sessions found');
          } else {
            this.showToast('error', response.message || 'Failed to load sessions');
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        if (error.status === 404) {
          this.sessions = [];
          this.filteredSessions = [];
          this.showToast('info', error.error?.message || 'No sessions found');
        } else {
          this.showToast('error', 'Failed to load sessions. Please check your connection.');
        }
        this.isLoading = false;
      }
    });
  }

  private mapApiStatus(apiStatus: string): 'active' | 'inactive' | 'completed' {
    switch (apiStatus?.toLowerCase()) {
      case 'active': return 'active';
      case 'inactive': return 'inactive';
      case 'completed': return 'completed';
      default: return 'inactive';
    }
  }

  private applySearchFilter() {
    let filtered = [...this.sessions];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(term) ||
        session.description.toLowerCase().includes(term)
      );
    }
    
    this.filteredSessions = filtered;
  }

  // ============================================================
  // CREATE SESSION VIA API
  // ============================================================
  createSession() {
    if (!this.newSession.title || !this.newSession.startDate || !this.newSession.endDate) {
      this.showToast('error', 'Please fill in all required fields');
      return;
    }

    const startDate = new Date(this.newSession.startDate);
    const endDate = new Date(this.newSession.endDate);

    if (startDate >= endDate) {
      this.showToast('error', 'End date must be after start date');
      return;
    }

    this.isCreating = true;

    const sessionData: SessionAddDto = {
      name: this.newSession.title,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    this.adminService.createSession(sessionData).subscribe({
      next: (response) => {
        this.isCreating = false;
        
        if (response.isSuccess) {
          this.showToast('success', response.message || 'Session created successfully!');
          this.closeCreateModal();
          this.loadSessions();
        } else {
          this.showToast('error', response.message || 'Failed to create session');
        }
      },
      error: (error) => {
        this.isCreating = false;
        console.error('Error creating session:', error);
        
        let errorMessage = 'Failed to create session. Please try again.';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.showToast('error', errorMessage);
      }
    });
  }

  // ============================================================
  // UPDATE SESSION STATUS - LOCAL (for UI click)
  // ============================================================
  updateSessionStatusLocally(status: string) {
    if (this.selectedSession) {
      this.selectedSession.status = status as 'active' | 'inactive' | 'completed';
    }
  }

  // ============================================================
  // UPDATE SESSION STATUS - API CALL (for Save button)
  // ============================================================
  updateSessionStatusApi() {
    if (!this.selectedSession) return;
    
    this.isUpdating = true;
    
    const status = this.selectedSession.status;
    
    let statusEnum: SessionStatusEnum;
    switch (status) {
      case 'active':
        statusEnum = SessionStatusEnum.Active;
        break;
      case 'inactive':
        statusEnum = SessionStatusEnum.Inactive;
        break;
      case 'completed':
        statusEnum = SessionStatusEnum.Completed;
        break;
      default:
        statusEnum = SessionStatusEnum.Inactive;
    }
    
    const request = {
      sessionId: this.selectedSession.id,
      status: statusEnum
    };
    
    this.adminService.updateSessionStatus(request).subscribe({
      next: (response) => {
        this.isUpdating = false;
        
        if (response.isSuccess) {
          // Update in sessions array
          const index = this.sessions.findIndex(s => s.id === this.selectedSession!.id);
          if (index !== -1) {
            this.sessions[index].status = this.selectedSession!.status;
          }
          this.applySearchFilter();
          
          this.showToast('success', response.message || 'Session status updated successfully!');
          this.closeEditModal();
          this.loadSessions();
        } else {
          this.showToast('error', response.message || 'Failed to update session status');
        }
      },
      error: (error) => {
        this.isUpdating = false;
        console.error('Error updating session status:', error);
        
        let errorMessage = 'Failed to update session status. Please try again.';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.showToast('error', errorMessage);
      }
    });
  }

  // ============================================================
  // FILTER METHODS
  // ============================================================
  onSearchChange() {
    this.applySearchFilter();
  }

  onStatusFilterChange() {
    this.loadSessions();
  }

  // ============================================================
  // UI HELPER METHODS
  // ============================================================
  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'inactive': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'active': return 'fas fa-play-circle';
      case 'inactive': return 'fas fa-pause-circle';
      case 'completed': return 'fas fa-check-circle';
      default: return 'fas fa-circle';
    }
  }

  getStatusDotColor(status: string): string {
    switch(status) {
      case 'active': return '#10b981';
      case 'inactive': return '#f59e0b';
      case 'completed': return '#3b82f6';
      default: return '#64748b';
    }
  }

  formatDateRange(session: Session): string {
    const start = session.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = session.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} — ${end}`;
  }

  getStatusCount(status: string): number {
    return this.sessions.filter(s => s.status === status).length;
  }

  // ============================================================
  // MODAL METHODS
  // ============================================================
  openCreateModal() {
    this.newSession = {
      title: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  openEditModal(session: Session) {
    this.selectedSession = { ...session };
    this.originalStatus = session.status; // Store original status
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedSession = null;
  }

  deleteSession(id: string) {
    if (confirm('Are you sure you want to delete this session?')) {
      this.sessions = this.sessions.filter(s => s.id !== id);
      this.applySearchFilter();
      this.showToast('success', 'Session deleted successfully!');
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // ============================================================
  // TOAST NOTIFICATION
  // ============================================================
  showToast(type: string, message: string) {
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `custom-toast fixed bottom-4 right-4 z-[9999] px-6 py-3 rounded-xl shadow-lg animate-slide-up ${
      type === 'success' ? 'bg-emerald-500 text-white' : 
      type === 'info' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.style.position = 'fixed';
    toast.style.bottom = '1rem';
    toast.style.right = '1rem';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}"></i>
        <span class="text-sm font-semibold">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast && toast.remove) {
        toast.remove();
      }
    }, 3000);
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : status;
  }
}