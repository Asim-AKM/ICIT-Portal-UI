import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserItem {
  userId: string;
  fullName: string;
  userName: string;
  email: string;
  contact: string;
  cnic: string;
  imageUrl: string;
  department: string;
  departmentId: string;
  role: string;
  status: number;  // 1=Active, 0=Inactive
  createdAt: string;
}


export interface UpdateUserRequest {
  userId: string;
  fullName: string;
  userName: string;
  contact: string;
  cnic: string;
  email: string;
  role: string;
  departmentId: string;
  status: number;
}

// In UserService class

export interface PaginatedUsers {
  items: UserItem[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
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
export class UserService {

  private baseUrl = 'https://localhost:5001/api/User';

  constructor(private http: HttpClient) { }

  getAllUsers(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedUsers>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedUsers>>(`${this.baseUrl}/get-all-users`, {
      params,
      withCredentials: true
    });
  }


  // In UserService class
  updateUser(payload: UpdateUserRequest): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/update-user`, payload, {
      withCredentials: true
    });
  }

  filterUsers(
    role?: string,
    status?: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<ApiResponse<PaginatedUsers>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (role && role !== 'all') {
      params = params.set('role', role);
    }
    if (status !== undefined && status !== null) {
      params = params.set('status', status.toString());
    }

    return this.http.get<ApiResponse<PaginatedUsers>>(`${this.baseUrl}/filter-users`, {
      params,
      withCredentials: true
    });
  }
}