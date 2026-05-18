// faculty.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response/api-response.model';

export interface FacultySubject {
  subjectId: string;
  title: string;
  departmentId: string;
  departmentName: string;
  semesterId: string;
  semesterName: string;
  facultyId: string;
  facultyName: string;
  isActive: boolean;
}

export interface EnrolledStudent {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  gradeId: string | null;
  grade: string | null;
  gradePoints: number | null;
  midtermMarks: number | null;
  finalMarks: number | null;
  assignmentMarks: number | null;
  quizMarks: number | null;
  totalMarks: number | null;
}

export interface GradeRequest {
  enrollmentId: string;
  midtermMarks: number;
  finalMarks: number;
  assignmentMarks: number;
  quizMarks: number;
}

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private baseUrl = 'https://localhost:5001/api/Faculty';

  constructor(private http: HttpClient) {}

  getMySubjects(): Observable<ApiResponse<FacultySubject[]>> {
    return this.http.get<ApiResponse<FacultySubject[]>>(
      `${this.baseUrl}/my-subjects`,
      { withCredentials: true }
    );
  }

  getEnrolledStudents(subjectId: string): Observable<ApiResponse<EnrolledStudent[]>> {
    const params = new HttpParams().set('subjectId', subjectId);
    return this.http.get<ApiResponse<EnrolledStudent[]>>(
      `${this.baseUrl}/get-enrolled-students`,
      { params, withCredentials: true }
    );
  }

  assignGrade(payload: GradeRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/assign-grade`,
      payload,
      { withCredentials: true }
    );
  }
}