// src/app/core/services/admin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response/api-response.model'; 
import { SessionAddDto } from '../../models/admin/session-add.dto';
import { SessionGetDto } from '../../models/admin/session-get.dto';
import { SessionStatusEnum } from '../../models/enums/session-status.enum';


export interface StudentDto {
  studentId: string;
  userId: string;
  registrationNo: string;
  rollNo: string;
  semesterId: string;
  sessionId: string;
  studentName: string;
  studentEmail: string;
  cnic: string;
  department: string;
  status: string;
  semesterName : string
}

export interface VerifyStudentRequest {
  studentIds: string[];
  status: number; // 2 = Verified, 3 = Rejected
}



export interface UpdateSessionStatusRequest {
  sessionId: string;
  status: SessionStatusEnum;
}

// Update VerifyStudentRequest
export interface VerifyStudentRequest {
  studentIds: string[];
  status: number; // 1 = Unverified, 2 = Verified, 3 = Rejected
}

// Response interface
export interface BulkVerifyResponse {
  total: number;
  success: number;
  failed: number;
  failedStudents: string[];
  alreadyVerified: string[];
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'https://localhost:5001/api/Admin';

  constructor(private http: HttpClient) {}

  /**
   * Create a new academic session
   * POST /api/Admin/CreateSession
   */
  createSession(session: SessionAddDto): Observable<ApiResponse<SessionAddDto>> {
    return this.http.post<ApiResponse<SessionAddDto>>(
      `${this.baseUrl}/CreateSession`,
      session
    );
  }

  /**
   * Get all sessions (without filter)
   * GET /api/Admin/GetSession-by-Status (no parameter)
   */
  getSessions(): Observable<ApiResponse<SessionGetDto[]>> {
    return this.http.get<ApiResponse<SessionGetDto[]>>(
      `${this.baseUrl}/GetSession-by-Status`
    );
  }

  /**
   * Get sessions by status (Active, Inactive, Completed)
   * GET /api/Admin/GetSession-by-Status?sessionStatus=1
   */
  getSessionsByStatus(status: SessionStatusEnum): Observable<ApiResponse<SessionGetDto[]>> {
    let params = new HttpParams();
    if (status !== undefined && status !== null) {
      params = params.set('sessionStatus', status.toString());
    }
    return this.http.get<ApiResponse<SessionGetDto[]>>(
      `${this.baseUrl}/GetSession-by-Status`,
      { params }
    );
  }

  /**
   * Update session status (Active, Inactive, Completed)
   * PUT /api/Admin/UpdateSessionStatus/{sessionId}
   */
  updateSessionStatus(request: UpdateSessionStatusRequest): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/UpdateSessionStatus/${request.sessionId}`,
      request
    );
  }



// Get students by session, department, status
getStudentsBySessionAndDept(sessionId: string, departmentId: string, studentStatus: number): Observable<ApiResponse<StudentDto[]>> {
  const params = new HttpParams()
    .set('SessionId', sessionId)
    .set('DepartmentId', departmentId)
    .set('StudentStatus', studentStatus.toString());

  return this.http.get<ApiResponse<StudentDto[]>>(
    `${this.baseUrl}/students-by-session-and-deprt`,
    { params, withCredentials: true }
  );
}

// Verify or reject students

verifyStudents(request: VerifyStudentRequest): Observable<ApiResponse<BulkVerifyResponse>> {
  return this.http.put<ApiResponse<BulkVerifyResponse>>(
    `${this.baseUrl}/Student-Bulk-Verify`,
    request,
    { withCredentials: true }
  );
}

}