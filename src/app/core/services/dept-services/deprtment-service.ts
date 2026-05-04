// src/app/core/services/department.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Department } from '../../models/dept/department.model';

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:5001';

  getDepartments(): Observable<Department[]> {
    return this.http.get<ApiResponse<Department[]>>(`${this.baseUrl}/Departments`)
      .pipe(
        map(response => response.data.map(dept => ({
          ...dept,
          // SWAP: API sends swapped code/description
          code: dept.description,
          description: dept.code
        })))
      );
  }
}