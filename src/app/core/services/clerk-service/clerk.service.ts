import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { SemesterDto } from '../../models/clerk-models/semester.dto';
import { FacultyDto } from '../../models/clerk-models/faculty.dto';

export interface SubjectRequest {
  title: string;
  departmentId: string;
  semesterId: string;
  facultyId: string | null;
  creditHours : number;
}

export interface SubjectItem {
  subjectId: string;
  title: string;
  departmentId: string;
  departmentName: string;
  semesterId: string;
  semesterName: string;
  facultyId: string | null;
  facultyName: string;
  creditHours: number;
  isActive: boolean;
}

export interface PaginatedSubjects {
  items: SubjectItem[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClerkService {
  private baseUrl = 'https://localhost:5001/api/Clerk';
  private subjectBaseUrl = 'https://localhost:5001/api/Subject';

  constructor(private http: HttpClient) {}

  // ============================================================
  // BULK ENROLLMENT
  // ============================================================
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

  // ============================================================
  // SUBJECT APIs
  // ============================================================
  getSubjectsByDeptAndSemester(
    departmentId: string, 
    semesterId: string, 
    pageNumber: number = 1, 
    pageSize: number = 10
  ): Observable<ApiResponse<PaginatedSubjects>> {
    const params = new HttpParams()
      .set('departmentId', departmentId)
      .set('semesterId', semesterId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<ApiResponse<PaginatedSubjects>>(
      `${this.subjectBaseUrl}/get-subjects-by-department-and-semester`,
      { params, withCredentials: true }
    );
  }

  createSubject(payload: SubjectRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.subjectBaseUrl}/create-subject`,
      payload,
      { withCredentials: true }
    );
  }

  updateSubject(payload: SubjectRequest & { subjectId: string; isActive: boolean }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.subjectBaseUrl}/update-subject`,
      payload,
      { withCredentials: true }
    );
  }

  deleteSubject(subjectId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.subjectBaseUrl}/delete-subject/${subjectId}`,
      { withCredentials: true }
    );
  }

  // ============================================================
  // FACULTY
  // ============================================================
  getFacultyByDepartment(departmentId: string): Observable<ApiResponse<FacultyDto[]>> {
    const params = new HttpParams().set('departmentId', departmentId);
    return this.http.get<ApiResponse<FacultyDto[]>>(
      `https://localhost:5001/api/Faculty/get-faculty-by-departmentId`,
      { params, withCredentials: true }
    );
  }

  // ============================================================
  // SEMESTERS
  // ============================================================
  getSemestersBySession(sessionId: string): Observable<ApiResponse<SemesterDto[]>> {
    const params = new HttpParams().set('sessionId', sessionId);
    return this.http.get<ApiResponse<SemesterDto[]>>(
      `https://localhost:5001/api/Semester/get-Semester-by-sessionId`,
      { params, withCredentials: true }
    );
  }
}