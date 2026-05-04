// src/app/core/models/dept/department.model.ts
export interface Department {
  departmentId: string;
  name: string;
  code: string;        // Actually description in API
  description: string;  // Actually code in API
  status: string;
}