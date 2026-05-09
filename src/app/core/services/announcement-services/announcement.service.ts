import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnnouncementRequest {
  title: string;
  message: string;
  announcementType: number;
  announcementTargetAudience: number;
  departmentId: string | null;
  sessionId: string | null;
  sendMailNotification: boolean;
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
export class AnnouncementService {
  
  private baseUrl = 'https://localhost:5001/api/Announcement';

  constructor(private http: HttpClient) {}

  createAnnouncement(payload: AnnouncementRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/create`,
      payload,
      { withCredentials: true }
    );
  }
}