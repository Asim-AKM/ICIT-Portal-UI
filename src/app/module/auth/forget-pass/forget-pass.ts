import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast-service/toast.service';

@Component({
  selector: 'app-forget-pass',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forget-pass.html',
  styleUrl: './forget-pass.css',
})
export class ForgetPass {
  
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);
  
  step: 'email' | 'otp' | 'reset' = 'email';
  
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  
  isLoading = false;
  timer = 0;
  private timerInterval: any;

  sendOtp() {
    if (!this.email.trim()) {
      this.toast.error('Please enter your email address');
      return;
    }
    
    this.isLoading = true;
    
    // TODO: API call to send OTP
    setTimeout(() => {
      this.isLoading = false;
      this.step = 'otp';
      this.startTimer();
      this.toast.success('OTP sent to your email');
    }, 1500);
  }

  verifyOtp() {
    if (!this.otp.trim() || this.otp.length !== 6) {
      this.toast.error('Please enter valid 6-digit OTP');
      return;
    }
    
    this.isLoading = true;
    
    // TODO: API call to verify OTP
    setTimeout(() => {
      this.isLoading = false;
      this.step = 'reset';
      this.toast.success('OTP verified successfully');
    }, 1000);
  }

  resetPassword() {
    if (!this.newPassword || this.newPassword.length < 8) {
      this.toast.error('Password must be at least 8 characters');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.toast.error('Passwords do not match');
      return;
    }
    
    this.isLoading = true;
    
    // TODO: API call to reset password
    setTimeout(() => {
      this.isLoading = false;
      this.toast.success('Password reset successfully!');
      this.router.navigate(['/login']);
    }, 1500);
  }

  startTimer() {
    this.timer = 60;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  resendOtp() {
    this.sendOtp();
  }

  goBack() {
    if (this.step === 'otp') {
      this.step = 'email';
      clearInterval(this.timerInterval);
    } else if (this.step === 'reset') {
      this.step = 'otp';
      this.startTimer();
    }
  }

  togglePassword(field: 'password' | 'confirm') {
    if (field === 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }
}