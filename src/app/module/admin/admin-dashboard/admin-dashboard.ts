import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Activity {
  id: string;
  admin: string;
  adminAvatar: string;
  event: string;
  impact: 'high' | 'medium' | 'low' | 'stable';
  time: string;
  timestamp: Date;
}

interface StatCard {
  title: string;
  value: number | string;
  change: number;
  icon: string;
  color: string;
  subItems?: { label: string; value: number; color: string }[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, OnDestroy {
  currentTime: Date = new Date();
  private timeInterval: any;
  
  stats: StatCard[] = [
    {
      title: 'Active Users',
      value: '2,481',
      change: 12.5,
      icon: 'fas fa-users',
      color: 'blue',
      subItems: [
        { label: 'Clerks', value: 12, color: 'blue' },
        { label: 'Faculty', value: 84, color: 'indigo' },
        { label: 'Students', value: 2385, color: 'cyan' }
      ]
    },
    {
      title: 'Active Teams',
      value: '312',
      change: 8.3,
      icon: 'fas fa-project-diagram',
      color: 'purple',
      subItems: [
        { label: 'Final Year', value: 187, color: 'purple' },
        { label: 'Research', value: 89, color: 'violet' },
        { label: 'Other', value: 36, color: 'purple' }
      ]
    },
    {
      title: 'Proposals',
      value: '156',
      change: -5.2,
      icon: 'fas fa-file-invoice',
      color: 'amber',
      subItems: [
        { label: 'Pending', value: 24, color: 'amber' },
        { label: 'Approved', value: 98, color: 'emerald' },
        { label: 'Rejected', value: 34, color: 'red' }
      ]
    },
    {
      title: 'Storage Usage',
      value: '42%',
      change: 15.2,
      icon: 'fas fa-server',
      color: 'emerald',
      subItems: [
        { label: 'Used', value: 42, color: 'emerald' },
        { label: 'Free', value: 58, color: 'slate' }
      ]
    }
  ];

  activities: Activity[] = [
    {
      id: '1',
      admin: 'Dr. Sarah Ahmed',
      adminAvatar: 'SA',
      event: 'Updated RBAC Policy - Added new roles for research staff',
      impact: 'high',
      time: '10:42 AM',
      timestamp: new Date()
    },
    {
      id: '2',
      admin: 'System Auto',
      adminAvatar: 'SA',
      event: 'Automated database backup completed successfully',
      impact: 'stable',
      time: '03:00 AM',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '3',
      admin: 'Prof. Michael Chen',
      adminAvatar: 'MC',
      event: 'New enrollment requests: 45 students pending verification',
      impact: 'medium',
      time: '09:15 AM',
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: '4',
      admin: 'Admin Team',
      adminAvatar: 'AT',
      event: 'Server maintenance scheduled for Sunday 2 AM',
      impact: 'low',
      time: 'Yesterday',
      timestamp: new Date(Date.now() - 86400000)
    }
  ];

  recentEnrollments = [
    { name: 'Ahmed Sheikh', rollNo: 'CS-2024-001', department: 'Computer Science', date: '2024-01-15', status: 'pending' },
    { name: 'Fatima Khan', rollNo: 'CS-2024-002', department: 'Computer Science', date: '2024-01-15', status: 'verified' },
    { name: 'Omar Riaz', rollNo: 'SE-2024-015', department: 'Software Engineering', date: '2024-01-14', status: 'pending' },
    { name: 'Zara Malik', rollNo: 'CS-2024-023', department: 'Computer Science', date: '2024-01-14', status: 'verified' }
  ];

  constructor() {}

  ngOnInit() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  // Add this helper method
  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  getImpactColor(impact: string): string {
    switch(impact) {
      case 'high': return 'red';
      case 'medium': return 'amber';
      case 'low': return 'blue';
      case 'stable': return 'emerald';
      default: return 'slate';
    }
  }

  getImpactIcon(impact: string): string {
    switch(impact) {
      case 'high': return 'fas fa-exclamation-triangle';
      case 'medium': return 'fas fa-chart-line';
      case 'low': return 'fas fa-info-circle';
      case 'stable': return 'fas fa-check-circle';
      default: return 'fas fa-circle';
    }
  }

  getDepartmentMixData() {
    return [
      { name: 'Computer Science', percentage: 62, color: 'emerald', count: 1538 },
      { name: 'Software Engineering', percentage: 28, color: 'blue', count: 694 },
      { name: 'Information Technology', percentage: 10, color: 'purple', count: 248 }
    ];
  }

  getStatusColor(status: string): string {
    return status === 'verified' ? 'emerald' : 'amber';
  }

  getStatusIcon(status: string): string {
    return status === 'verified' ? 'fas fa-check-circle' : 'fas fa-clock';
  }
}