import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TeamMember {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  role: 'leader' | 'member';
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  supervisor: string;
  cosupervisor?: string;  // Fixed: changed from coSupervisor to cosupervisor
  teamMembers: TeamMember[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'revision_requested';
  submittedDate?: Date;
  reviewComments?: string;
  revisionDeadline?: Date;
  isLocked: boolean;
  lockUntil?: Date;
  deadline: Date;
}

interface Supervisor {
  id: string;
  name: string;
  department: string;
  designation: string;
  availability: 'available' | 'busy' | 'full';
  researchAreas: string[];
}

@Component({
  selector: 'app-fyp-proposal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fyp-proposal.html',
  styleUrls: ['./fyp-proposal.css']
})
export class FypProposal implements OnInit {
  Math = Math;
  private isBrowser: boolean;
   currentDeadline: Date = new Date('2026-04-30');
  activeTab: 'view' | 'submit' = 'view';
  showTeamModal = false;
  showProposalModal = false;
  editingProposal = false;
  selectedProposal: Proposal | null = null;
  
  studentName = 'Ahmed Sheikh';
  studentRollNo = 'CS-2024-001';
  
  // Form models
  newProposal: Proposal = {
    id: '',
    title: '',
    description: '',
    category: '',
    technologies: [],
    supervisor: '',
    cosupervisor: '',  // Fixed: changed from coSupervisor to cosupervisor
    teamMembers: [],
    status: 'draft',
    isLocked: false,
    deadline: new Date('2026-04-30')
  };
  
  newMember: TeamMember = {
    id: '',
    name: '',
    rollNo: '',
    email: '',
    role: 'member'
  };
  
  techInput = '';
  categories = [
    'Web Development',
    'Mobile App Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science',
    'Cybersecurity',
    'Cloud Computing',
    'IoT',
    'Game Development',
    'Blockchain'
  ];
  
  supervisors: Supervisor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Ahmed',
      department: 'Computer Science',
      designation: 'Professor',
      availability: 'available',
      researchAreas: ['Web Development', 'Cloud Computing', 'AI']
    },
    {
      id: '2',
      name: 'Dr. Umar Farooq',
      department: 'Software Engineering',
      designation: 'Associate Professor',
      availability: 'available',
      researchAreas: ['Machine Learning', 'Data Science', 'IoT']
    },
    {
      id: '3',
      name: 'Prof. Fatima Zafar',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      availability: 'busy',
      researchAreas: ['Cybersecurity', 'Blockchain', 'Network Security']
    }
  ];
  
  proposals: Proposal[] = [
    {
      id: '1',
      title: 'AI-Powered Student Attendance System',
      description: 'An automated attendance system using facial recognition technology.',
      category: 'Artificial Intelligence',
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'React'],
      supervisor: 'Dr. Sarah Ahmed',
      cosupervisor: 'Dr. Umar Farooq',
      teamMembers: [
        { id: '1', name: 'Ahmed Sheikh', rollNo: 'CS-2024-001', email: 'ahmed@icit.edu', role: 'leader' },
        { id: '2', name: 'Kashif Farooq', rollNo: 'CS-2024-002', email: 'kashif@icit.edu', role: 'member' }
      ],
      status: 'under_review',
      submittedDate: new Date('2026-04-10'),
      isLocked: true,
      lockUntil: new Date('2026-04-30'),
      deadline: new Date('2026-04-30')
    },
    {
      id: '2',
      title: 'E-Learning Platform with Gamification',
      description: 'Interactive learning platform with game mechanics for student engagement.',
      category: 'Web Development',
      technologies: ['Angular', 'Node.js', 'MongoDB', 'Express'],
      supervisor: 'Dr. Umar Farooq',
      teamMembers: [
        { id: '1', name: 'Ahmed Sheikh', rollNo: 'CS-2024-001', email: 'ahmed@icit.edu', role: 'leader' }
      ],
      status: 'approved',
      submittedDate: new Date('2026-04-05'),
      reviewComments: 'Excellent proposal! Approved for implementation.',
      isLocked: false,
      deadline: new Date('2026-04-30')
    }
  ];
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  ngOnInit() {
    this.loadStudentData();
    this.loadProposals();
  }
  
  loadStudentData() {
    if (this.isBrowser) {
      const savedName = localStorage.getItem('studentName');
      if (savedName) this.studentName = savedName;
    }
  }
  
  loadProposals() {
    if (this.isBrowser) {
      const saved = localStorage.getItem('fypProposals');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.proposals = parsed.map((p: any) => ({
          ...p,
          submittedDate: p.submittedDate ? new Date(p.submittedDate) : undefined,
          lockUntil: p.lockUntil ? new Date(p.lockUntil) : undefined,
          deadline: new Date(p.deadline),
          revisionDeadline: p.revisionDeadline ? new Date(p.revisionDeadline) : undefined
        }));
      }
    }
  }
  
  saveProposals() {
    if (this.isBrowser) {
      localStorage.setItem('fypProposals', JSON.stringify(this.proposals));
    }
  }
  
  get myProposals(): Proposal[] {
    return this.proposals.filter(p => 
      p.teamMembers.some(m => m.rollNo === this.studentRollNo)
    );
  }
  
  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'draft': return 'status-draft';
      case 'submitted': return 'status-submitted';
      case 'under_review': return 'status-review';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'revision_requested': return 'status-revision';
      default: return 'status-default';
    }
  }
  
  getStatusIcon(status: string): string {
    switch(status) {
      case 'draft': return 'fas fa-pen';
      case 'submitted': return 'fas fa-paper-plane';
      case 'under_review': return 'fas fa-search';
      case 'approved': return 'fas fa-check-circle';
      case 'rejected': return 'fas fa-times-circle';
      case 'revision_requested': return 'fas fa-edit';
      default: return 'fas fa-question-circle';
    }
  }
  
  getStatusLabel(status: string): string {
    switch(status) {
      case 'draft': return 'Draft';
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'revision_requested': return 'Revision Requested';
      default: return status;
    }
  }
  
  getProposalLockStatus(proposal: Proposal): { isLocked: boolean; message: string } {
    if (proposal.isLocked && proposal.lockUntil) {
      const now = new Date();
      if (now < proposal.lockUntil) {
        const hoursLeft = Math.ceil((proposal.lockUntil.getTime() - now.getTime()) / (1000 * 60 * 60));
        return { isLocked: true, message: `Locked for ${hoursLeft} hours (preventing last-minute changes)` };
      } else {
        return { isLocked: false, message: 'Lock has expired' };
      }
    }
    return { isLocked: false, message: '' };
  }
  
  addTechnology() {
    if (this.techInput.trim() && !this.newProposal.technologies.includes(this.techInput.trim())) {
      this.newProposal.technologies.push(this.techInput.trim());
      this.techInput = '';
    }
  }
  
  removeTechnology(tech: string) {
    this.newProposal.technologies = this.newProposal.technologies.filter(t => t !== tech);
  }
  
  openTeamModal() {
    this.showTeamModal = true;
  }
  
  closeTeamModal() {
    this.showTeamModal = false;
    this.resetNewMember();
  }
  
  resetNewMember() {
    this.newMember = {
      id: '',
      name: '',
      rollNo: '',
      email: '',
      role: 'member'
    };
  }
  
  addTeamMember() {
    if (this.newMember.name && this.newMember.rollNo && this.newMember.email) {
      this.newMember.id = Date.now().toString();
      this.newProposal.teamMembers.push({ ...this.newMember });
      this.resetNewMember();
      
      if (this.newProposal.teamMembers.length === 1) {
        this.newProposal.teamMembers[0].role = 'leader';
      }
    }
  }
  
  removeTeamMember(memberId: string) {
    this.newProposal.teamMembers = this.newProposal.teamMembers.filter(m => m.id !== memberId);
  }
  
  openProposalModal(proposal?: Proposal) {
    if (proposal) {
      this.editingProposal = true;
      this.selectedProposal = proposal;
      this.newProposal = { ...proposal };
    } else {
      this.editingProposal = false;
      this.selectedProposal = null;
      this.resetProposalForm();
    }
    this.showProposalModal = true;
  }
  
  closeProposalModal() {
    this.showProposalModal = false;
    this.selectedProposal = null;
    this.resetProposalForm();
  }
  
  resetProposalForm() {
    this.newProposal = {
      id: '',
      title: '',
      description: '',
      category: '',
      technologies: [],
      supervisor: '',
      cosupervisor: '',
      teamMembers: [],
      status: 'draft',
      isLocked: false,
      deadline: new Date('2026-04-30')
    };
    this.techInput = '';
  }
  
  submitProposal() {
    if (!this.newProposal.title || !this.newProposal.description || !this.newProposal.category || !this.newProposal.supervisor) {
      this.showToast('error', 'Please fill all required fields');
      return;
    }
    
    if (this.newProposal.teamMembers.length === 0) {
      this.showToast('error', 'Please add at least one team member');
      return;
    }
    
    if (this.editingProposal && this.selectedProposal) {
      const index = this.proposals.findIndex(p => p.id === this.selectedProposal!.id);
      if (index !== -1) {
        this.proposals[index] = {
          ...this.newProposal,
          id: this.selectedProposal.id,
          status: this.selectedProposal.status === 'draft' ? 'submitted' : this.selectedProposal.status,
          submittedDate: this.selectedProposal.status === 'draft' ? new Date() : this.selectedProposal.submittedDate
        };
        this.showToast('success', 'Proposal updated successfully!');
      }
    } else {
      const deadline = new Date('2026-04-30');
      if (new Date() > deadline) {
        this.showToast('error', 'Proposal submission deadline has passed!');
        return;
      }
      
      const newId = (Math.max(...this.proposals.map(p => parseInt(p.id)), 0) + 1).toString();
      const proposal: Proposal = {
        ...this.newProposal,
        id: newId,
        status: 'submitted',
        submittedDate: new Date(),
        isLocked: true,
        lockUntil: new Date('2026-04-30')
      };
      this.proposals.unshift(proposal);
      this.showToast('success', 'Proposal submitted successfully!');
    }
    
    this.saveProposals();
    this.closeProposalModal();
  }
  
  getDaysRemaining(deadline: Date): number {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  showToast(type: string, message: string) {
    if (!this.isBrowser) return;
    
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-slide-up ${
      type === 'success' ? 'bg-emerald-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`;
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span class="text-sm font-semibold">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}