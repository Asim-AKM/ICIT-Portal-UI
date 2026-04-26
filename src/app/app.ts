import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Header } from './shared/visitor/header/header';
import { Footer } from './shared/visitor/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer,  CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ICIT-Portal');
  
  constructor(public router: Router) {}
}