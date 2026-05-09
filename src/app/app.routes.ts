
import { Routes } from '@angular/router';

// ================= PUBLIC =================
import { Index } from './module/visitor/index';
import { About } from './module/visitor/about/about';
import { Events } from './module/visitor/events/events';
import { Downloads } from './module/visitor/downloads/downloads';
import { Explore } from './module/visitor/explore/explore';
import { Login } from './module/auth/login/login';
import { ForgetPass } from './module/auth/forget-pass/forget-pass';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component/unauthorized.component';

// ================= ADMIN =================
import { AdminDashboard } from './module/admin/admin-dashboard/admin-dashboard';
import { AddUser } from './module/admin/add-user/add-user';
import { Announcement } from './module/admin/announcement/announcement';
import { BulkStudentVerification } from './module/admin/bulk-student-verification/bulk-student-verification';
import { AdminProfile } from './module/admin/admin-profile/admin-profile';
import { SessionDetails } from './module/admin/session-details/session-details';
import { Users } from './module/admin/users/users';
import { EditUser } from './module/admin/edit-user/edit-user';
import { StudentVerification } from './module/admin/student-varification/student-varification';
import { AddSessions } from './module/admin/add-sessions/add-sessions';

// ================= STUDENT =================
import { StudentDashboard } from './module/student/student-dashboard/student-dashboard';
import { SemesterDetails } from './module/student/semester-details/semester-details';
import { FeeRecords } from './module/student/fee-records/fee-records';
import { FypProposal } from './module/student/fyp-proposal/fyp-proposal';
import { StudentTranscript } from './module/student/student-transcript/student-transcript';
import { StudentProfile } from './module/student/student-profile/student-profile';

// ================= CLERK =================
import { ClerkDashboard } from './module/clerk/clerk-dashboard/clerk-dashboard';
import { SingleEnrollment } from './module/clerk/single-enrollment/single-enrollment';
import { BulkEnrollment } from './module/clerk/bulk-enrollment/bulk-enrollment';
import { FeeCollection } from './module/clerk/fee-collection/fee-collection';
import { StudentRecords } from './module/clerk/student-records/student-records';
import { GenerateChallan } from './module/clerk/generate-challan/generate-challan';
import { FeeCollectionReports } from './module/clerk/fee-collection-reports/fee-collection-reports';
import { StudentReports } from './module/clerk/student-reports/student-reports';
import { ClerkProfile } from './module/clerk/clerk-profile/clerk-profile';

// ================= FACULTY =================
import { FacultyDashboard } from './module/faculty/faculty-dashboard/faculty-dashboard';
import { FacultyProfile } from './module/faculty/faculty-profile/faculty-profile';
import { ProjectEvaluation } from './module/faculty/project-evaluation/project-evaluation';

// ================= Common =================
import { ProfileComponent } from './shared/profile/profile';
import { NotificationView } from './shared/notification-view/notification-view';
import { NotificationCenter } from './shared/notification-center/notification-center';

// ================= GUARD =================
import { AuthGuard } from './core/guard/auth.guard';

export const routes: Routes = [

  // ============================================================
  // PUBLIC ROUTES
  // ============================================================
  { path: '', component: Index },
  { path: 'about', component: About },
  { path: 'events', component: Events },
  { path: 'download', component: Downloads },
  { path: 'explore', component: Explore },
  { path: 'login', component: Login },
  { path: 'forget-pass', component: ForgetPass },
  { path: 'unauthorized', component: UnauthorizedComponent },

  // ============================================================
  // Common ROUTES
  // ============================================================
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'notification-view/:id', component: NotificationView, canActivate: [AuthGuard] },
  { path: 'notifications-center', component: NotificationCenter, canActivate: [AuthGuard] },

  // ============================================================
  // ADMIN ROUTES
  // ============================================================
  { path: 'admin-dashboard', component: AdminDashboard, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: 'add-user', component: AddUser, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: 'announcement', component: Announcement, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: 'bulk-student-verification', component: BulkStudentVerification, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: 'admin-profile', component: AdminProfile, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: 'session-details', component: SessionDetails, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: 'users', component: Users, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: 'student-verification', component: StudentVerification, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: 'add-sessions', component: AddSessions, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: 'edit-user', component: EditUser, canActivate: [AuthGuard], data: { role: 'Admin' } },

  // ============================================================
  // STUDENT ROUTES
  // ============================================================
  { path: 'student-dashboard', component: StudentDashboard, canActivate: [AuthGuard], data: { role: 'Student' } },
  { path: 'semester-details', component: SemesterDetails, canActivate: [AuthGuard], data: { role: 'Student' } },
  { path: 'fee-records', component: FeeRecords, canActivate: [AuthGuard], data: { role: 'Student' } },
  { path: 'fyp-proposal', component: FypProposal, canActivate: [AuthGuard], data: { role: 'Student' } },
  { path: 'student-transcript', component: StudentTranscript, canActivate: [AuthGuard], data: { role: 'Student' } },
  { path: 'student-profile', component: StudentProfile, canActivate: [AuthGuard], data: { role: 'Student' } },

  // ============================================================
  // CLERK ROUTES
  // ============================================================
  { path: 'clerk-dashboard', component: ClerkDashboard, canActivate: [AuthGuard], data: { role: 'Clerk' } },
  { path: 'single-enrollment', component: SingleEnrollment, canActivate: [AuthGuard], data: { role: 'Clerk' } },
  { path: 'bulk-enrollment', component: BulkEnrollment, canActivate: [AuthGuard], data: { role: 'Clerk' } },
  { path: 'fee-collection', component: FeeCollection, canActivate: [AuthGuard], data: { role: 'Clerk' } },
  { path: 'student-records', component: StudentRecords, canActivate: [AuthGuard], data: { role: 'Clerk' } },
  { path: 'generate-challan', component: GenerateChallan, canActivate: [AuthGuard], data: { role: 'Clerk' } },
  { path: 'fee-collection-reports', component: FeeCollectionReports, canActivate: [AuthGuard], data: { role: 'Clerk' } },
  { path: 'student-reports', component: StudentReports, canActivate: [AuthGuard], data: { role: 'Clerk' } },
  { path: 'clerk-profile', component: ClerkProfile, canActivate: [AuthGuard], data: { role: 'Clerk' } },

  // ============================================================
  // FACULTY ROUTES
  // ============================================================
  { path: 'faculty-dashboard', component: FacultyDashboard, canActivate: [AuthGuard], data: { role: 'Faculty' } },
  { path: 'faculty-profile', component: FacultyProfile, canActivate: [AuthGuard], data: { role: 'Faculty' } },
  { path: 'project-evaluation', component: ProjectEvaluation, canActivate: [AuthGuard], data: { role: 'Faculty' } },

  // ============================================================
  // FALLBACK ROUTE (IMPORTANT)
  // ============================================================
{ path: '**', redirectTo: 'login' }
];

