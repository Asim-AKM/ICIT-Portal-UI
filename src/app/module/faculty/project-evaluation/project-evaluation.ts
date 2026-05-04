import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface FYPTeam {
  id: string;
  projectTitle: string;
  category: string;
  students: Student[];
  semester: number;
  status: 'requested' | 'approved' | 'in_progress' | 'completed';
  progress: number;
  milestones: Milestone[];
  meetingLogs: MeetingLog[];
  finalEvaluation?: FinalEvaluation;
}

interface Student {
  name: string;
  rollNo: string;
  email: string;
  phone: string;
}

interface Milestone {
  name: string;
  dueDate: Date;
  submittedDate?: Date;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  feedback?: string;
}

interface MeetingLog {
  id: string;
  date: Date;
  duration: string;
  agenda: string;
  discussion: string;
  actionItems: string;
  nextMeeting: Date;
}

interface FinalEvaluation {
  presentationScore: number;
  vivaScore: number;
  reportScore: number;
  totalScore: number;
  grade: string;
  comments: string;
  evaluatedDate: Date;
}

@Component({
  selector: 'app-project-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-evaluation.html',
  styleUrls: ['./project-evaluation.css']
})
export class ProjectEvaluation implements OnInit {
  Math = Math;
  private isBrowser: boolean;
  
  // Active Tab
  activeTab: string = 'requests';
  
  // Modal
  showEvaluationModal: boolean = false;
  showMeetingModal: boolean = false;
  showFinalEvaluationModal: boolean = false;
  selectedTeam: FYPTeam | null = null;
  
  // Meeting Form
  newMeeting: MeetingLog = {
    id: '',
    date: new Date(),
    duration: '',
    agenda: '',
    discussion: '',
    actionItems: '',
    nextMeeting: new Date()
  };
  
  // Final Evaluation Form
  finalEvaluationForm: FinalEvaluation = {
    presentationScore: 0,
    vivaScore: 0,
    reportScore: 0,
    totalScore: 0,
    grade: '',
    comments: '',
    evaluatedDate: new Date()
  };
  
  // Data
  supervisionRequests: FYPTeam[] = [];
  supervisedTeams: FYPTeam[] = [];
  completedTeams: FYPTeam[] = [];
  
  // Statistics
  totalRequests: number = 0;
  activeTeams: number = 0;
  pendingMilestones: number = 0;
  averageScore: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadData();
    this.calculateStatistics();
  }

  loadData() {
    // Mock Data - Replace with API call
    this.supervisionRequests = [
      {
        id: '1',
        projectTitle: 'AI-Powered Student Attendance System',
        category: 'Artificial Intelligence',
        students: [
          { name: 'Ahmed Sheikh', rollNo: 'CS-2024-001', email: 'ahmed@icit.edu.pk', phone: '+92-300-1234567' },
          { name: 'Kashif Farooq', rollNo: 'CS-2024-002', email: 'kashif@icit.edu.pk', phone: '+92-300-7654321' }
        ],
        semester: 5,
        status: 'requested',
        progress: 0,
        milestones: [],
        meetingLogs: []
      },
      {
        id: '2',
        projectTitle: 'Smart Traffic Management System',
        category: 'IoT',
        students: [
          { name: 'Omar Riaz', rollNo: 'SE-2024-023', email: 'omar@icit.edu.pk', phone: '+92-300-3456789' },
          { name: 'Sara Khan', rollNo: 'IT-2024-005', email: 'sara@icit.edu.pk', phone: '+92-300-2345678' }
        ],
        semester: 5,
        status: 'requested',
        progress: 0,
        milestones: [],
        meetingLogs: []
      }
    ];

    this.supervisedTeams = [
      {
        id: '3',
        projectTitle: 'Blockchain-based Certificate Verification',
        category: 'Blockchain',
        students: [
          { name: 'Usman Chaudhry', rollNo: 'CS-2024-089', email: 'usman@icit.edu.pk', phone: '+92-300-1234568' }
        ],
        semester: 7,
        status: 'in_progress',
        progress: 75,
        milestones: [
          { name: 'Proposal Submission', dueDate: new Date('2025-10-15'), submittedDate: new Date('2025-10-10'), status: 'approved', feedback: 'Good proposal' },
          { name: 'SRS Document', dueDate: new Date('2025-11-30'), submittedDate: new Date('2025-11-25'), status: 'approved', feedback: 'Well documented' },
          { name: 'Design Document', dueDate: new Date('2026-01-15'), submittedDate: new Date('2026-01-10'), status: 'approved', feedback: 'Good architecture' },
          { name: 'Implementation Phase 1', dueDate: new Date('2026-02-28'), submittedDate: undefined, status: 'pending', feedback: '' },
          { name: 'Implementation Phase 2', dueDate: new Date('2026-03-30'), submittedDate: undefined, status: 'pending', feedback: '' }
        ],
        meetingLogs: [
          { id: '1', date: new Date('2026-01-10'), duration: '1 hour', agenda: 'Discuss project progress', discussion: 'Reviewed design document', actionItems: 'Start coding', nextMeeting: new Date('2026-01-24') }
        ]
      }
    ];

    this.completedTeams = [
      {
        id: '4',
        projectTitle: 'E-Learning Platform',
        category: 'Web Development',
        students: [
          { name: 'Fatima Khan', rollNo: 'CS-2024-015', email: 'fatima@icit.edu.pk', phone: '+92-300-4567890' }
        ],
        semester: 8,
        status: 'completed',
        progress: 100,
        milestones: [],
        meetingLogs: [],
        finalEvaluation: {
          presentationScore: 85,
          vivaScore: 82,
          reportScore: 88,
          totalScore: 85,
          grade: 'A',
          comments: 'Excellent project with real-world application',
          evaluatedDate: new Date('2026-03-15')
        }
      }
    ];
  }

  calculateStatistics() {
    this.totalRequests = this.supervisionRequests.length;
    this.activeTeams = this.supervisedTeams.length;
    this.pendingMilestones = this.supervisedTeams.reduce((sum, team) => 
      sum + team.milestones.filter(m => m.status === 'pending').length, 0);
    
    const scores = this.completedTeams.filter(t => t.finalEvaluation).map(t => t.finalEvaluation!.totalScore);
    this.averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  acceptRequest(team: FYPTeam) {
    team.status = 'approved';
    this.supervisionRequests = this.supervisionRequests.filter(t => t.id !== team.id);
    this.supervisedTeams.push(team);
    this.calculateStatistics();
    this.showToast('success', 'Supervision request accepted!');
  }

  rejectRequest(team: FYPTeam) {
    if (confirm('Are you sure you want to reject this supervision request?')) {
      this.supervisionRequests = this.supervisionRequests.filter(t => t.id !== team.id);
      this.calculateStatistics();
      this.showToast('warning', 'Request rejected');
    }
  }

  viewTeamDetails(team: FYPTeam) {
    this.selectedTeam = { ...team };
    this.showEvaluationModal = true;
  }

  openMeetingModal(team: FYPTeam) {
    this.selectedTeam = { ...team };
    this.newMeeting = {
      id: Date.now().toString(),
      date: new Date(),
      duration: '',
      agenda: '',
      discussion: '',
      actionItems: '',
      nextMeeting: new Date()
    };
    this.showMeetingModal = true;
  }

  saveMeetingLog() {
    if (this.selectedTeam) {
      this.selectedTeam.meetingLogs.push({ ...this.newMeeting });
      const index = this.supervisedTeams.findIndex(t => t.id === this.selectedTeam!.id);
      if (index !== -1) {
        this.supervisedTeams[index] = { ...this.selectedTeam };
      }
      this.showToast('success', 'Meeting log saved!');
      this.closeMeetingModal();
    }
  }

  closeMeetingModal() {
    this.showMeetingModal = false;
    this.selectedTeam = null;
  }

  openFinalEvaluation(team: FYPTeam) {
    this.selectedTeam = { ...team };
    this.finalEvaluationForm = {
      presentationScore: 0,
      vivaScore: 0,
      reportScore: 0,
      totalScore: 0,
      grade: '',
      comments: '',
      evaluatedDate: new Date()
    };
    this.showFinalEvaluationModal = true;
  }

  calculateTotalScore() {
    this.finalEvaluationForm.totalScore = Math.round(
      (this.finalEvaluationForm.presentationScore + 
       this.finalEvaluationForm.vivaScore + 
       this.finalEvaluationForm.reportScore) / 3
    );
    
    if (this.finalEvaluationForm.totalScore >= 90) this.finalEvaluationForm.grade = 'A+';
    else if (this.finalEvaluationForm.totalScore >= 85) this.finalEvaluationForm.grade = 'A';
    else if (this.finalEvaluationForm.totalScore >= 80) this.finalEvaluationForm.grade = 'A-';
    else if (this.finalEvaluationForm.totalScore >= 75) this.finalEvaluationForm.grade = 'B+';
    else if (this.finalEvaluationForm.totalScore >= 70) this.finalEvaluationForm.grade = 'B';
    else if (this.finalEvaluationForm.totalScore >= 60) this.finalEvaluationForm.grade = 'C';
    else this.finalEvaluationForm.grade = 'F';
  }

  submitFinalEvaluation() {
    if (this.selectedTeam) {
      this.selectedTeam.status = 'completed';
      this.selectedTeam.finalEvaluation = { ...this.finalEvaluationForm };
      
      const index = this.supervisedTeams.findIndex(t => t.id === this.selectedTeam!.id);
      if (index !== -1) {
        this.supervisedTeams.splice(index, 1);
        this.completedTeams.unshift(this.selectedTeam);
      }
      
      this.calculateStatistics();
      this.showToast('success', 'Final evaluation submitted!');
      this.closeFinalEvaluationModal();
    }
  }

  closeFinalEvaluationModal() {
    this.showFinalEvaluationModal = false;
    this.selectedTeam = null;
  }

  closeModal() {
    this.showEvaluationModal = false;
    this.selectedTeam = null;
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'requested': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  getMilestoneStatusClass(status: string): string {
    switch(status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 75) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-amber-500';
    return 'bg-red-500';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  showToast(type: string, message: string) {
    if (!this.isBrowser) return;
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-slide-up ${
      type === 'success' ? 'bg-emerald-500 text-white' : 
      type === 'warning' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`;
    toast.innerHTML = `<div class="flex items-center gap-2"><i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i><span class="text-sm font-semibold">${message}</span></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}