import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audition',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AuditionComponent {}
