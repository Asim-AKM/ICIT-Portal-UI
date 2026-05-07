import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  userId: string;
  fullName: string;
  userName: string;
  email: string;
  contact: string;
  cnic: string;
  createdAt: string;
  role: string;
  department: string;
  imageUrl: string;  // ✅ Added
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
export class ProfileService {
  
  private baseUrl = 'https://localhost:5001/api/Account';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.baseUrl}/Profile`, {
      withCredentials: true
    });
  }

  uploadProfileImage(userId: string, file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.put<ApiResponse<string>>(
      `${this.baseUrl}/UploadProfileImage?UserId=${userId}`,
      formData,
      { withCredentials: true }
    );
  }
  
  removeProfileImage(userId: string): Observable<ApiResponse<string>> {
  return this.http.delete<ApiResponse<string>>(
    `${this.baseUrl}/remove-profile-image/${userId}`,
    { withCredentials: true }
  );
}
}