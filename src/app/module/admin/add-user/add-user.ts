import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CreateAccountService } from '../../../core/services/account-services/create-account-service';
import { Department } from '../../../core/models/dept/department.model';
import { ToastService } from '../../../core/services/toast-service/toast.service';
import { CreateAccountRequest } from '../../../core/services/account-services/create-account-service';

interface UserForm {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  cnic: string;
  departmentId: string;
  phoneNumber: string;
  generateTempPassword: boolean;
  sendWelcomeEmail: boolean;
}

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser implements OnInit {
  
  user: UserForm = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    cnic: '',
    departmentId: '',
    phoneNumber: '',
    generateTempPassword: true,
    sendWelcomeEmail: true
  };

  departments: Department[] = [];  // ✅ Ab backend se aayenge
  isLoadingDepartments = false;
  isSubmitting = false;

  roles = [
    { value: 'Admin', label: 'Admin', description: 'Full system access', icon: 'fas fa-user-shield' },
    { value: 'Faculty', label: 'Faculty', description: 'Teaching staff access', icon: 'fas fa-chalkboard-user' },
    { value: 'Clerk', label: 'Clerk', description: 'Administrative staff', icon: 'fas fa-file-alt' },
    { value: 'Student', label: 'Student', description: 'Student portal access', icon: 'fas fa-user-graduate' }
  ];

  passwordStrength: number = 0;
  passwordStrengthText: string = '';
  passwordStrengthColor: string = '';

  constructor(
    private router: Router,
    private createAccountService: CreateAccountService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.isLoadingDepartments = true;
    this.createAccountService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data;
        this.isLoadingDepartments = false;
      },
      error: () => {
        this.toast.error('Failed to load departments');
        this.isLoadingDepartments = false;
      }
    });
  }

  checkPasswordStrength() {
    const password = this.user.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    
    this.passwordStrength = strength;
    
    switch(strength) {
      case 0:
      case 1:
        this.passwordStrengthText = 'Very Weak';
        this.passwordStrengthColor = 'bg-red-500';
        break;
      case 2:
        this.passwordStrengthText = 'Weak';
        this.passwordStrengthColor = 'bg-orange-500';
        break;
      case 3:
        this.passwordStrengthText = 'Medium';
        this.passwordStrengthColor = 'bg-yellow-500';
        break;
      case 4:
        this.passwordStrengthText = 'Strong';
        this.passwordStrengthColor = 'bg-emerald-500';
        break;
      case 5:
        this.passwordStrengthText = 'Very Strong';
        this.passwordStrengthColor = 'bg-green-600';
        break;
    }
  }

  getPasswordStrengthWidth(): string {
    return `${(this.passwordStrength / 5) * 100}%`;
  }

  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }

  isFormValid(): boolean {
    const generateTempPassword = this.user.generateTempPassword === true;
    
    return !!this.user.fullName &&
           !!this.user.username &&
           !!this.user.email &&
           !!this.user.role &&
           (generateTempPassword || (!!this.user.password && !!this.user.confirmPassword && this.passwordsMatch()));
  }

  generateUsername() {
    if (this.user.fullName) {
      const name = this.user.fullName.toLowerCase().split(' ');
      if (name.length >= 2) {
        this.user.username = `${name[0]}.${name[1]}`;
      } else {
        this.user.username = name[0];
      }
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid || !this.isFormValid()) return;
    
    this.isSubmitting = true;
    
    const payload: CreateAccountRequest = {
      departmentId: this.user.departmentId,
      fullName: this.user.fullName,
      userName: this.user.username,
      email: this.user.email,
      cnic: this.user.cnic,
      password: this.user.generateTempPassword ? '' : this.user.password,
      role: this.user.role,
      generatTempPassword: this.user.generateTempPassword,
      sendWelcomeEmail: this.user.sendWelcomeEmail
    };
    
    this.createAccountService.createAccount(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.toast.success(res.message || 'Account created successfully!');
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.log('Full error:', err);  // ✅ Add this
        this.isSubmitting = false;
        const message = err.error?.message || 'Failed to create account';
        this.toast.error(message);
      }
    });
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}