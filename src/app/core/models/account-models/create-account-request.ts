export interface CreateAccountRequest {
  departmentId: string;        // ✅ GUID string
  fullName: string;            // ✅ camelCase
  userName: string;            // ✅ camelCase
  email: string;
  cnic: string;
  password: string;
  role: string;                // "Admin" | "Faculty" | "Clerk" | "Student"
  generatTempPassword: boolean; // ✅ same spelling as API
  sendWelcomeEmail: boolean;
}