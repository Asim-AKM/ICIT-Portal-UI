import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, of } from 'rxjs';
import { Router } from '@angular/router';

export interface UserData {
  userId: string;
  fullName: string;
  email: string;
  cnic: string;
  role: string;
  rollNo?: string;
  employeeId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:5001/api/Authentication';

  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private authReadySubject = new BehaviorSubject<boolean>(false);
  authReady$ = this.authReadySubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  // ✅ Check if user is logged in (synchronously)
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // ✅ Getter for current user (sync)
  getStoredUser(): UserData | null {
    return this.currentUserSubject.value;
  }

  // 🔐 LOGIN
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Login`, credentials, {
      withCredentials: true
    });
  }

  // 👤 GET USER (from cookie via backend)
  getCurrentUser(): Observable<UserData> {
    return this.http.get<UserData>(`${this.baseUrl}/Me`, {
      withCredentials: true
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.authReadySubject.next(true);
      })
    );
  }

  // 🔓 LOGOUT
logout(): void {
  this.http.post(`${this.baseUrl}/Logout`, {}, {
    withCredentials: true
  }).subscribe({
    next: () => {
      this.currentUserSubject.next(null);
      this.authReadySubject.next(false);
      // Small delay then hard reload
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    },
    error: () => {
      this.currentUserSubject.next(null);
      this.authReadySubject.next(false);
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    }
  });
}
// ✅ NAYA (seedha Promise return karega)
loadUserFromServer(): Promise<void> {
  console.log('🔄 loadUserFromServer called');
  
  return new Promise<void>((resolve) => {
    this.getCurrentUser().subscribe({
      next: (user) => {
        console.log('✅ User loaded:', user?.fullName);
        this.currentUserSubject.next(user);
        this.authReadySubject.next(true);
        resolve();
      },
      error: (err) => {
        console.log('❌ /Me failed:', err?.status, err?.message);
        this.currentUserSubject.next(null);
        this.authReadySubject.next(true);
        resolve();
      }
    });

    // ⛑️ Failsafe - Time kam karo (3 sec)
    setTimeout(() => {
      if (!this.authReadySubject.value) {
        console.log('⏰ Failsafe triggered');
        this.authReadySubject.next(true);
      }
      resolve();
    }, 3000);
  });
}
}