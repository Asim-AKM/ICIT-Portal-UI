// src/app/core/services/admin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response/api-response.model'; 
import { SessionAddDto } from '../../models/admin/session-add.dto';
import { SessionGetDto } from '../../models/admin/session-get.dto';
import { SessionStatusEnum } from '../../models/enums/session-status.enum';

export interface UpdateSessionStatusRequest {
  sessionId: string;
  status: SessionStatusEnum;
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
}