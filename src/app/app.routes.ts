import { Routes } from '@angular/router';
import { Index } from './module/visitor/index';
import { About } from './module/visitor/about/about';
import { Events } from './module/visitor/events/events';
import { Downloads } from './module/visitor/downloads/downloads';
import { Explore } from './module/visitor/explore/explore';
import { Login } from './module/auth/login/login';
import { ForgetPass } from './module/auth/forget-pass/forget-pass';
import { AddUser } from './module/admin/add-user/add-user';
import { Announcement } from './module/admin/announcement/announcement';
import { BulkStudentVerification } from './module/admin/bulk-student-verification/bulk-student-verification';
import { AdminProfile } from './module/admin/admin-profile/admin-profile';
import { SessionDetails } from './module/admin/session-details/session-details';
import { Users } from './module/admin/users/users';
import { AdminDashboard } from './module/admin/admin-dashboard/admin-dashboard';
import { StudentVerification } from './module/admin/student-varification/student-varification';
import { AddSessions } from './module/admin/add-sessions/add-sessions';
import { StudentDashboard } from './module/student/student-dashboard/student-dashboard';
import { SemesterDetails } from './module/student/semester-details/semester-details';
import { FeeRecords } from './module/student/fee-records/fee-records';
import { FypProposal } from './module/student/fyp-proposal/fyp-proposal';
import { StudentTranscript } from './module/student/student-transcript/student-transcript';
import { StudentNotifications } from './module/student/student-notifications/student-notifications';
import { StudentProfile } from './module/student/student-profile/student-profile';
import { ClerkDashboard } from './module/clerk/clerk-dashboard/clerk-dashboard';
import { SingleEnrollment } from './module/clerk/single-enrollment/single-enrollment';
import { BulkEnrollment } from './module/clerk/bulk-enrollment/bulk-enrollment';
import { FeeCollection } from './module/clerk/fee-collection/fee-collection';
import { StudentRecords } from './module/clerk/student-records/student-records';
import { GenerateChallan } from './module/clerk/generate-challan/generate-challan';

export const routes: Routes = 
[
    {path : '',component :Index},
    {path : 'about',component : About},
    {path : 'events',component:Events},
    {path: 'download',component:Downloads},
    {path : 'explore',component:Explore},
    {path: 'login',component:Login},
    {path : 'forget-pass',component:ForgetPass},
    {path : 'admin-dashboard',component:AdminDashboard},
    {path: 'add-user',component:AddUser},
    {path: 'announcement',component:Announcement},
    {path: 'bulk-student-verification',component:BulkStudentVerification},
    {path: 'admin-profile',component:AdminProfile},
    {path: 'session-details',component:SessionDetails},
    {path: 'student-verification',component:StudentVerification},
    {path: 'users',component:Users},
    {path: 'add-sessions',component:AddSessions},
    {path: 'student-dashboard',component:StudentDashboard},
    {path: 'semester-details',component:SemesterDetails},
    {path: 'fee-records',component:FeeRecords},
    {path: 'fyp-proposal',component:FypProposal},
    {path: 'student-transcript',component:StudentTranscript},
    {path: 'student-notifications',component:StudentNotifications},
    {path: 'student-profile',component:StudentProfile},
    {path: 'student-profile',component:StudentProfile},
    {path: 'clerk-dashboard',component:ClerkDashboard},
    {path: 'single-enrollment',component:SingleEnrollment},
    {path: 'bulk-enrollment',component:BulkEnrollment},
    {path: 'fee-collection',component:FeeCollection},
    {path: 'student-records',component:StudentRecords},
    {path: 'generate-challan',component:GenerateChallan},


];
