import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent {}
