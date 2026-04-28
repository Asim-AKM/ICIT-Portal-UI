import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'faculty' | 'clerk' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  lastLogin: Date;
  avatar: string;
  employeeId: string;
  department: string;
  joinDate: Date;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  searchTerm: string = '';
  selectedRole: string = 'all';
  selectedStatus: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  
  users: User[] = [];
  
  // Stats for dashboard
  totalUsers: number = 0;
  activeUsers: number = 0;
  facultyCount: number = 0;
  clerkCount: number = 0;
  
  constructor() {}
  
  ngOnInit() {
    this.loadUsers();
    this.updateStats();
  }
  
  loadUsers() {
    // Mock data - replace with API call
    this.users = [
      {
        id: '1',
        name: 'Dr. Zaid Ali',
        email: 'zaid.ali@icit.edu.pk',
        role: 'faculty',
        status: 'active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        avatar: 'ZA',
        employeeId: 'FAC-2024-001',
        department: 'Computer Science',
        joinDate: new Date('2023-08-15')
      },
      {
        id: '2',
        name: 'Sara Khan',
        email: 'sara.khan@icit.edu.pk',
        role: 'clerk',
        status: 'suspended',
        lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        avatar: 'SK',
        employeeId: 'CLK-2024-042',
        department: 'Registrar Office',
        joinDate: new Date('2024-01-10')
      },
      {
        id: '3',
        name: 'Prof. Ahmed Raza',
        email: 'ahmed.raza@icit.edu.pk',
        role: 'faculty',
        status: 'active',
        lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        avatar: 'AR',
        employeeId: 'FAC-2023-089',
        department: 'Software Engineering',
        joinDate: new Date('2023-01-20')
      },
      {
        id: '4',
        name: 'Fatima Bilal',
        email: 'fatima.b@icit.edu.pk',
        role: 'clerk',
        status: 'active',
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        avatar: 'FB',
        employeeId: 'CLK-2024-015',
        department: 'Accounts Office',
        joinDate: new Date('2024-02-01')
      },
      {
        id: '5',
        name: 'Admin User',
        email: 'admin@icit.edu.pk',
        role: 'admin',
        status: 'active',
        lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        avatar: 'AU',
        employeeId: 'ADM-001',
        department: 'IT Administration',
        joinDate: new Date('2022-01-01')
      },
      {
        id: '6',
        name: 'Dr. Maria Khan',
        email: 'maria.khan@icit.edu.pk',
        role: 'faculty',
        status: 'pending',
        lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        avatar: 'MK',
        employeeId: 'FAC-2024-112',
        department: 'Computer Science',
        joinDate: new Date('2024-02-15')
      },
      {
        id: '7',
        name: 'Usman Chaudhry',
        email: 'usman.c@icit.edu.pk',
        role: 'clerk',
        status: 'active',
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        avatar: 'UC',
        employeeId: 'CLK-2023-078',
        department: 'Examination Office',
        joinDate: new Date('2023-11-10')
      },
      {
        id: '8',
        name: 'Dr. Nida Aslam',
        email: 'nida.aslam@icit.edu.pk',
        role: 'faculty',
        status: 'active',
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        avatar: 'NA',
        employeeId: 'FAC-2023-056',
        department: 'Information Technology',
        joinDate: new Date('2023-09-05')
      }
    ];
  }
  
  updateStats() {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(u => u.status === 'active').length;
    this.facultyCount = this.users.filter(u => u.role === 'faculty').length;
    this.clerkCount = this.users.filter(u => u.role === 'clerk').length;
  }
  
  get filteredUsers(): User[] {
    let filtered = this.users;
    
    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.employeeId.toLowerCase().includes(term)
      );
    }
    
    // Filter by role
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }
    
    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === this.selectedStatus);
    }
    
    return filtered;
  }
  
  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredUsers.slice(start, end);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }
  
  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  
  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
  }
  
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  getRoleBadgeClass(role: string): string {
    switch(role) {
      case 'faculty': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'clerk': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'admin': return 'bg-purple-50 text-purple-700 border border-purple-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  }
  
  getRoleIcon(role: string): string {
    switch(role) {
      case 'faculty': return 'fas fa-chalkboard-user';
      case 'clerk': return 'fas fa-file-alt';
      case 'admin': return 'fas fa-user-shield';
      default: return 'fas fa-user';
    }
  }
  
  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'suspended': return 'bg-red-50 text-red-700 border border-red-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  }
  
  getStatusIcon(status: string): string {
    switch(status) {
      case 'active': return 'fas fa-circle';
      case 'suspended': return 'fas fa-ban';
      case 'pending': return 'fas fa-clock';
      default: return 'fas fa-question';
    }
  }
  
  getStatusDotColor(status: string): string {
    switch(status) {
      case 'active': return 'bg-emerald-500';
      case 'suspended': return 'bg-red-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  }
  
  formatLastLogin(date: Date): string {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  
  editUser(userId: string) {
    console.log('Edit user:', userId);
    // Navigate to edit page or open modal
  }
  
  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(u => u.id !== userId);
      this.updateStats();
      // Recalculate pagination
      if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
  
  toggleUserStatus(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'active' ? 'suspended' : 'active';
      this.updateStats();
    }
  }
  
  resetFilters() {
    this.searchTerm = '';
    this.selectedRole = 'all';
    this.selectedStatus = 'all';
    this.currentPage = 1;
  }
  
  getRoleLabel(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }
  
  getTotalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}