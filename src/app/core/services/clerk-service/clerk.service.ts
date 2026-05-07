import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ClerkService {
  private baseUrl = 'https://localhost:5001/api/Clerk';

  constructor(private http: HttpClient) {}

  /**
   * Upload Bulk Student Data via Excel
   * POST /api/Clerk/Upload-Student-BulkData?SessionId={sessionId}
   */
 uploadBulkStudents(sessionId: string, departmentId: string, file: File): Observable<ApiResponse<string>> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sessionId', sessionId);
  formData.append('DepartmentId', departmentId);

  return this.http.post<ApiResponse<string>>(
    `${this.baseUrl}/Upload-Student-BulkData`,
    formData,
    { withCredentials: true }
  );
}
}