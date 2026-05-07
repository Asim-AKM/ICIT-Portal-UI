import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService, UserItem, UpdateUserRequest } from '../../../core/services/user-services/user.service';
import { CreateAccountService, Department } from '../../../core/services/account-services/create-account-service';
import { ToastService } from '../../../core/services/toast-service/toast.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser implements OnInit {
  
  private userService = inject(UserService);
  private createAccountService = inject(CreateAccountService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  
  userId: string = '';
  isLoading: boolean = false;
  isSaving: boolean = false;
  departments: Department[] = [];
  
  user = {
    fullName: '',
    userName: '',
    email: '',
    contact: '',
    cnic: '',
    departmentId: '',
    role: '',
    status: 1
  };
  
  statusOptions = [
    { value: 1, label: 'Active', icon: 'fas fa-circle', color: 'emerald' },
    { value: 2, label: 'Inactive', icon: 'fas fa-ban', color: 'red' },
    { value: 3, label: 'Blocked', icon: 'fas fa-lock', color: 'slate' },
    { value: 4, label: 'Suspended', icon: 'fas fa-clock', color: 'amber' }
  ];

  roles = [
    { value: 'Admin', label: 'Admin', description: 'Full system access', icon: 'fas fa-user-shield' },
    { value: 'Faculty', label: 'Faculty', description: 'Teaching staff access', icon: 'fas fa-chalkboard-user' },
    { value: 'Clerk', label: 'Clerk', description: 'Administrative staff', icon: 'fas fa-file-alt' },
    { value: 'Student', label: 'Student', description: 'Student portal access', icon: 'fas fa-user-graduate' }
  ];

  ngOnInit() {

      window.scrollTo({ top: 0, behavior: 'smooth' });  // ✅ Scroll to top
    this.loadDepartments();
    
    const userData = history.state?.userData as UserItem;
    if (userData) {
      this.populateForm(userData);
    } else {
      this.toast.error('No user data found');
      this.router.navigate(['/users']);
    }
  }
  
  loadDepartments() {
    this.isLoading = true;
    this.createAccountService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toast.error('Failed to load departments');
      }
    });
  }
  
  populateForm(userData: UserItem) {
    this.userId = userData.userId;
    this.user = {
      fullName: userData.fullName || '',
      userName: userData.userName || '',
      email: userData.email || '',
      contact: userData.contact || '',
      cnic: userData.cnic || '',
      departmentId: userData.departmentId || '',
      role: userData.role || '',
      status: userData.status || 1
    };
    this.cdr.detectChanges();
  }
  
  isFormValid(): boolean {
    return !!this.user.fullName &&
           !!this.user.userName &&
           !!this.user.email &&
           !!this.user.role;
  }
  
  onSubmit(form: NgForm) {
    if (!form.valid || !this.isFormValid()) return;
    
    this.isSaving = true;
    this.cdr.detectChanges();
    
    const payload: UpdateUserRequest = {
      userId: this.userId,
      fullName: this.user.fullName,
      userName: this.user.userName,
      contact: this.user.contact,
      cnic: this.user.cnic,
      email: this.user.email,
      role: this.user.role,
      departmentId: this.user.departmentId,
      status: this.user.status
    };
    
    this.userService.updateUser(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.cdr.detectChanges();
        this.toast.success(res.message || 'User updated successfully!');
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.isSaving = false;
        this.cdr.detectChanges();
        const message = err.error?.message || 'Failed to update user';
        this.toast.error(message);
      }
    });
  }
  
  cancel() {
    this.router.navigate(['/users']);
  }
}