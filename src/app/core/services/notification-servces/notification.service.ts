import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationItem {
  notificationId: string;
  title: string;
  message: string;
  notificationType: string;
  announcementType: string | null;
  isRead: boolean;
  createdAt: string;
  actionUrl: string | null;
  senderName: string;
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
export class NotificationService {
  
  private baseUrl = 'https://localhost:5001/api/Notification';

  constructor(private http: HttpClient) {}

  /** Get latest notifications (read + unread) */
  getRecentNotifications(): Observable<ApiResponse<NotificationItem[]>> {
    return this.http.get<ApiResponse<NotificationItem[]>>(
      `${this.baseUrl}/recent`,
      { withCredentials: true }
    );
  }

  /** Get only unread notifications */
  getMyNotifications(): Observable<ApiResponse<NotificationItem[]>> {
    return this.http.get<ApiResponse<NotificationItem[]>>(
      `${this.baseUrl}/my-notification`,
      { withCredentials: true }
    );
  }

  /** Mark single notification as read */
  markAsRead(notificationId: string): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.baseUrl}/mark-as-read-notification/${notificationId}`,
      {},
      { withCredentials: true }
    );
  }
}