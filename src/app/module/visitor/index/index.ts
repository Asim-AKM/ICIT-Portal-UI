import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit, OnDestroy {
  slides: string[] = [
    'assets/images/hero-section-2.jpg',
    'assets/images/hero-section-1.jpg',
    'assets/images/hero-section-3.jpg'
  ];
  
  currentSlide: number = 0;
  private intervalId: any;

  ngOnInit(): void {
    // Optional: Remove auto-slide or keep it commented
    // this.intervalId = setInterval(() => {
    //   this.nextSlide();
    // }, 3000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}