import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService, UserItem, UpdateUserRequest } from '../../../core/services/user-services/user.service';
import { ToastService } from '../../../core/services/toast-service/toast.service';
import { ConfirmDialogService } from '../../../core/services/generic-services/confirm-dialog.service';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css',
})


export class Users implements OnInit {

  private router = inject(Router);
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private confirmDialog = inject(ConfirmDialogService);


  roleOptions = [
    { value: 'Admin', label: 'Admin', icon: 'fas fa-user-shield' },
    { value: 'Faculty', label: 'Faculty', icon: 'fas fa-chalkboard-user' },
    { value: 'Clerk', label: 'Clerk', icon: 'fas fa-file-alt' },
    { value: 'Student', label: 'Student', icon: 'fas fa-user-graduate' }
  ];

  // Filters
  searchTerm: string = '';
  selectedRole: string = 'all';
  selectedStatus: string = 'all';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  // Data
  users: UserItem[] = [];
  isLoading: boolean = false;

  // Stats
  activeUsers: number = 0;
  facultyCount: number = 0;
  clerkCount: number = 0;





  ngOnInit() {
    this.loadUsers();
  }

  // Update editUser method
  editUser(user: UserItem) {
    this.router.navigate(['/edit-user'], {
      state: { userData: user }
    });
  }

  loadUsers() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.users = res.data.items;
        this.totalRecords = res.data.totalRecords;
        this.updateStats();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load users');
      }
    });
  }

loadFilteredUsers() {
  this.isLoading = true;
  this.cdr.detectChanges();
  
  let roleParam: string | undefined = this.selectedRole !== 'all' ? this.selectedRole : undefined;
  let statusParam: number | undefined = undefined;
  
  // ✅ All status values handle karo
  switch(this.selectedStatus) {
    case 'active': statusParam = 1; break;
    case 'inactive': statusParam = 2; break;
    case 'blocked': statusParam = 3; break;
    case 'suspended': statusParam = 4; break;
    default: statusParam = undefined;
  }
  
  this.userService.filterUsers(roleParam, statusParam, this.currentPage, this.pageSize).subscribe({
    next: (res) => {
      this.users = res.data.items;
      this.totalRecords = res.data.totalRecords;
      this.updateStats();
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.isLoading = false;
      this.cdr.detectChanges();
      this.toast.error('Failed to filter users');
    }
  });
}
  updateStats() {
    this.facultyCount = this.users.filter(u => u.role.toLowerCase() === 'faculty').length;
    this.clerkCount = this.users.filter(u => u.role.toLowerCase() === 'clerk').length;
    this.activeUsers = this.users.filter(u => u.status === 1).length;
  }

  get paginatedUsers(): UserItem[] {
    if (!this.searchTerm) return this.users;

    const term = this.searchTerm.toLowerCase();
    return this.users.filter(user =>
      user.fullName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.userName.toLowerCase().includes(term)
    );
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  get startItem(): number {
    if (this.totalRecords === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  onFilterChange() {
    this.currentPage = 1;

    const hasFilters = this.selectedRole !== 'all' ||
      (this.selectedStatus !== 'all');

    if (hasFilters) {
      this.loadFilteredUsers();
    } else {
      this.loadUsers();
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if (this.selectedRole !== 'all' || this.selectedStatus !== 'all') {
        this.loadFilteredUsers();
      } else {
        this.loadUsers();
      }
    }
  }

  getAvatar(name: string): string {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'Active';
      case 2: return 'Inactive';
      case 3: return 'Blocked';
      case 4: return 'Suspended';
      default: return 'Unknown';
    }
  }

  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 1: return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 2: return 'bg-red-50 text-red-700 border border-red-200';
      case 3: return 'bg-slate-100 text-slate-700 border border-slate-300';
      case 4: return 'bg-amber-50 text-amber-700 border border-amber-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  }

  getStatusIcon(status: number): string {
    switch (status) {
      case 1: return 'fas fa-circle';
      case 2: return 'fas fa-ban';
      case 3: return 'fas fa-lock';
      case 4: return 'fas fa-clock';
      default: return 'fas fa-question';
    }
  }

  getStatusDotColor(status: number): string {
    switch (status) {
      case 1: return 'bg-emerald-500';
      case 2: return 'bg-red-500';
      case 3: return 'bg-slate-500';
      case 4: return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  }

  getRoleLabel(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  getRoleBadgeClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'faculty': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'clerk': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'admin': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'student': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  }

  getRoleIcon(role: string): string {
    switch (role.toLowerCase()) {
      case 'faculty': return 'fas fa-chalkboard-user';
      case 'clerk': return 'fas fa-file-alt';
      case 'admin': return 'fas fa-user-shield';
      case 'student': return 'fas fa-user-graduate';
      default: return 'fas fa-user';
    }
  }

  // ==================== ACTIONS ====================

// Delete User
async deleteUser(userId: string) {
  const confirmed = await this.confirmDialog.confirm({
    title: 'Delete User?',
    message: 'This action is permanent and cannot be undone. All user data will be removed from the system.',
    confirmText: 'Delete Forever',
    cancelText: 'Keep User',
    type: 'danger',
    icon: 'fas fa-trash-alt'
  });
  
  if (confirmed) {
    // API call
    this.toast.success('User deleted');
  }
}
 async toggleUserStatus(user: UserItem) {
  const newStatus = user.status === 1 ? 2 : 1; // Active → Inactive, Inactive → Active
  const action = newStatus === 1 ? 'Activate' : 'Deactivate';
  
  const confirmed = await this.confirmDialog.confirm({
    title: `${action} User?`,
    message: `Are you sure you want to ${action.toLowerCase()} <b>${user.fullName}</b>? Their access will be ${newStatus === 1 ? 'restored' : 'revoked'}.`,
    confirmText: `Yes, ${action}`,
    cancelText: 'Cancel',
    type: action === 'Deactivate' ? 'warning' : 'info',
    icon: action === 'Deactivate' ? 'fas fa-ban' : 'fas fa-check-circle'
  });
  
  if (!confirmed) return;

  const payload: UpdateUserRequest = {
    userId: user.userId,
    fullName: user.fullName,
    userName: user.userName,
    contact: user.contact,
    cnic: user.cnic,
    email: user.email,
    role: user.role,
    departmentId: user.departmentId,
    status: newStatus
  };

  this.userService.updateUser(payload).subscribe({
    next: () => {
      this.toast.success(`User ${action}d successfully!`);
      this.loadUsers();
    },
    error: (err) => {
      this.toast.error(err.error?.message || `Failed to ${action.toLowerCase()} user`);
    }
  });
}

  resetFilters() {
    this.searchTerm = '';
    this.selectedRole = 'all';
    this.selectedStatus = 'all';
    this.currentPage = 1;
    this.loadUsers();
  }

  getTotalPagesArray(): number[] {
    const pages = this.totalPages;
    if (pages <= 7) {
      return Array(pages).fill(0).map((_, i) => i + 1);
    }

    // Show limited pages with ellipsis logic
    const result: number[] = [];
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        result.push(i);
      }
    }
    return result;
  }
}