import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  
  searchTerm: string = '';
  statusFilter: string = 'all';
  
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

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    // Mock data - replace with API call
    this.sessions = [
      {
        id: '1',
        title: 'Spring Semester 2026',
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-06-30'),
        status: 'active',
        createdAt: new Date('2025-10-01'),
        enrollmentCount: 1245,
        description: 'Regular spring semester for all programs'
      },
      {
        id: '2',
        title: 'Winter Term 2025',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-12-20'),
        status: 'inactive',
        createdAt: new Date('2025-07-15'),
        enrollmentCount: 890,
        description: 'Winter short courses and internships'
      },
      {
        id: '3',
        title: 'Fall Semester 2025',
        startDate: new Date('2025-08-15'),
        endDate: new Date('2025-12-10'),
        status: 'completed',
        createdAt: new Date('2025-05-20'),
        enrollmentCount: 2100,
        description: 'Regular fall semester'
      },
      {
        id: '4',
        title: 'Summer Break 2026',
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-08-31'),
        status: 'inactive',
        createdAt: new Date('2026-02-10'),
        enrollmentCount: 450,
        description: 'Summer vacation period'
      }
    ];
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.sessions];
    
    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(term) ||
        session.description.toLowerCase().includes(term)
      );
    }
    
    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === this.statusFilter);
    }
    
    this.filteredSessions = filtered;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

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
      case 'active': return 'bg-emerald-500';
      case 'inactive': return 'bg-amber-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-slate-500';
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

    const newId = (Math.max(...this.sessions.map(s => parseInt(s.id)), 0) + 1).toString();
    const session: Session = {
      id: newId,
      title: this.newSession.title,
      startDate: startDate,
      endDate: endDate,
      status: 'inactive',
      createdAt: new Date(),
      enrollmentCount: 0,
      description: this.newSession.description || 'No description provided'
    };

    this.sessions.unshift(session);
    this.applyFilters();
    this.closeCreateModal();
    this.showToast('success', 'Session created successfully!');
  }

  openEditModal(session: Session) {
    this.selectedSession = { ...session };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedSession = null;
  }

  updateSession() {
    if (this.selectedSession) {
      const index = this.sessions.findIndex(s => s.id === this.selectedSession!.id);
      if (index !== -1) {
        this.sessions[index] = this.selectedSession;
        this.applyFilters();
        this.showToast('success', 'Session updated successfully!');
      }
    }
    this.closeEditModal();
  }

  updateSessionStatus(status: string) {
    if (this.selectedSession) {
      this.selectedSession.status = status as 'active' | 'inactive' | 'completed';
    }
  }

  deleteSession(id: string) {
    if (confirm('Are you sure you want to delete this session?')) {
      this.sessions = this.sessions.filter(s => s.id !== id);
      this.applyFilters();
      this.showToast('success', 'Session deleted successfully!');
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
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
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : status;
  }
}