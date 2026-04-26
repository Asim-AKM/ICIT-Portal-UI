import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forget-pass',
  imports: [RouterLink, CommonModule],
  templateUrl: './forget-pass.html',
  styleUrl: './forget-pass.css',
})
export class ForgetPass {}
