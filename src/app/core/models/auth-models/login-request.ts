// core/models/auth-models/login-request.ts
export interface LoginRequest {
  cnic: string;
  password: string;
}

export interface LoginResponse {
  data: any;
  isSuccess: boolean;
  message: string;
  status: number;
}