import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-footer.html',
  styleUrl: './dashboard-footer.css',
})
export class DashboardFooter implements OnInit {
  currentYear: number = new Date().getFullYear();
  
  // Social Links
  socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com', color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com', color: 'hover:bg-sky-500' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: 'https://linkedin.com', color: 'hover:bg-blue-700' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com', color: 'hover:bg-pink-600' },
    { name: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com', color: 'hover:bg-red-600' }
  ];
  
  // Quick Links
  quickLinks = [
    { name: 'Dashboard', route: '/dashboard' },
    { name: 'Profile', route: '/profile' },
    { name: 'Settings', route: '/settings' },
    { name: 'Help & Support', route: '/support' },
    { name: 'FAQs', route: '/faqs' }
  ];
  
  // Resources
  resources = [
    { name: 'Documentation', route: '/docs' },
    { name: 'API Reference', route: '/api' },
    { name: 'System Status', route: '/status' },
    { name: 'Release Notes', route: '/releases' },
    { name: 'Feedback', route: '/feedback' }
  ];
  
  // Contact Info
  contactInfo = {
    address: '123 University Road, Karachi, Pakistan',
    phone: '+92-21-1234567',
    email: 'support@icit.edu.pk',
    hours: 'Monday - Friday: 9:00 AM - 5:00 PM'
  };

  ngOnInit() {}
}