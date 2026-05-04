import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-services/auth.service';
import { LoginRequest } from '../../../core/models/auth-models/login-request';
import { ToastService } from '../../../core/services/toast-service/toast.service';

interface ValidationError {
  field: string;
  errors: string[];
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {

  credentials: LoginRequest = { cnic: '', password: '' };

  isLoading = false;
  errorMessage = '';
  showPassword = false;
  rememberMe = false;

  fieldErrors: { cnic?: string; password?: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    public cdr: ChangeDetectorRef,
    private zone: NgZone,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    const saved = localStorage.getItem('remembered_cnic');
    if (saved) {
      this.credentials.cnic = saved;
      this.rememberMe = true;
    }
  }

  onSubmit(): void {

    this.fieldErrors = {};
    this.isLoading = true;

    const formattedCnic = this.formatCnic(this.credentials.cnic);
    this.credentials.cnic = formattedCnic;

    this.authService.login(this.credentials).subscribe({

      next: () => {

        this.authService.getCurrentUser().subscribe({

          next: (user) => {

            this.isLoading = false;

            if (this.rememberMe) {
              localStorage.setItem('remembered_cnic', this.credentials.cnic);
            } else {
              localStorage.removeItem('remembered_cnic');
            }

            // ✅ SUCCESS TOAST
            this.toast.success(
              `${user.fullName}, logged in successfully as ${user.role}`
            );
            // ✅ ADD THIS LINE - Force set auth ready true
            this.authService['authReadySubject'].next(true);9
            
            this.redirectByRole(user.role);
          },

          error: () => {
            this.isLoading = false;
            this.toast.error('Failed to load user data');
          }
        });
      },

      error: (error) => {

        this.isLoading = false;

        const res = error.error;

        // ALWAYS show backend message
        const msg =
          res?.message ||
          res?.error ||
          'Something went wrong';

        if (error.status === 401) {
          this.toast.error(msg);
          return;
        }

        if (error.status === 400 && res?.data) {
          const messages = res.data
            .map((x: any) => x.errors.join(', '))
            .join(', ');

          this.toast.warning(messages);
          return;
        }

        this.toast.error(msg);
      }
    });
  }

  private redirectByRole(role: string): void {
    const routes: any = {
      Admin: '/admin-dashboard',
      Faculty: '/faculty-dashboard',
      Clerk: '/clerk-dashboard',
      Student: '/student-dashboard'
    };

    this.router.navigate([routes[role] || '/dashboard']);
  }

  private formatCnic(cnic: string): string {
    let d = cnic.replace(/\D/g, '');

    if (d.length > 5) d = d.slice(0, 5) + '-' + d.slice(5);
    if (d.length > 13) d = d.slice(0, 13) + '-' + d.slice(13);

    return d;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearFieldError(field: string) {
    if (field === 'cnic') this.fieldErrors.cnic = undefined;
    if (field === 'password') this.fieldErrors.password = undefined;
    this.errorMessage = '';
  }
}