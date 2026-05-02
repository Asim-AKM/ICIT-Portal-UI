// src/app/core/models/admin/session-get.dto.ts

export interface SessionGetDto {
  sessionId: string;
  name: string;
  startYear: string;
  endYear: string;
  status: string;  // "Active", "Inactive", "Completed"
}