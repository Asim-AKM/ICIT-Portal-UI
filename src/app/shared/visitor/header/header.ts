import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Login } from '../../../module/auth/login/login';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule,Login],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isMenuOpen = false;

  constructor(public router: Router) {}

  isActive(route: string): boolean {
    if (route === '/' && this.router.url === '/') {
      return true;
    }
    if (route !== '/' && this.router.url.startsWith(route)) {
      return true;
    }
    return false;
  }
}