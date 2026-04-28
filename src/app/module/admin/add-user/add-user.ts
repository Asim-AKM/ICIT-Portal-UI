import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

interface UserForm {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  employeeId: string;
  department: string;
  phoneNumber: string;
  generateTempPassword: boolean;  // Explicitly set as boolean
  sendWelcomeEmail: boolean;      // Explicitly set as boolean
}

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser {
  user: UserForm = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    employeeId: '',
    department: '',
    phoneNumber: '',
    generateTempPassword: true,   // boolean value
    sendWelcomeEmail: true        // boolean value
  };

  departments = [
    'Computer Science',
    'Software Engineering',
    'Information Technology',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Business Administration',
    'Registrar Office',
    'Accounts Office',
    'IT Administration',
    'Human Resources'
  ];

  roles = [
    { value: 'admin', label: 'Admin', description: 'Full system access', icon: 'fas fa-user-shield', color: 'purple' },
    { value: 'faculty', label: 'Faculty', description: 'Teaching staff access', icon: 'fas fa-chalkboard-user', color: 'blue' },
    { value: 'clerk', label: 'Clerk', description: 'Administrative staff', icon: 'fas fa-file-alt', color: 'amber' },
    { value: 'student', label: 'Student', description: 'Student portal access', icon: 'fas fa-user-graduate', color: 'emerald' }
  ];

  passwordStrength: number = 0;
  passwordStrengthText: string = '';
  passwordStrengthColor: string = '';

  constructor(private router: Router) {}

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
    // Explicitly check boolean values
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
    if (form.valid && this.isFormValid()) {
      console.log('Form submitted:', this.user);
      // Here you would call your API service
      
      // Show success message
      alert('User created successfully!');
      
      // Navigate back to users list
      this.router.navigate(['/users']);
    }
  }

  cancel() {
    this.router.navigate(['/users']);
  }

  getRoleIcon(roleValue: string): string {
    const role = this.roles.find(r => r.value === roleValue);
    return role ? role.icon : 'fas fa-user';
  }

  getRoleDescription(roleValue: string): string {
    const role = this.roles.find(r => r.value === roleValue);
    return role ? role.description : '';
  }
}