import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Department {
  departmentId: string;
  name: string;
  code: string;
  description: string;
  status: string;
}

export interface CreateAccountRequest {
  departmentId: string;
  fullName: string;
  userName: string;
  email: string;
  cnic: string;
  password: string;
  role: string;
  generatTempPassword: boolean;
  sendWelcomeEmail: boolean;
}

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {
  
  private baseUrl = 'https://localhost:5001';
  
  constructor(private http: HttpClient) { }

  getDepartments(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(`${this.baseUrl}/Departments`);
  }

  createAccount(payload: CreateAccountRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/Account/Account`, payload);
  }
}