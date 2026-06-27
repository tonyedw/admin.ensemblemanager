import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AdminSectionHttpApiService } from './section.service';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  accountId: string | null = null;
  sections: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: AdminSectionHttpApiService
  ) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    if (this.accountId) {
      this.getSections();
    }
  }

  getSections(): void {
    this.apiService.getSections(this.accountId!).subscribe({
      next: (data) => {
        this.sections = data;
      },
      error: (error) => {
        console.error('Error fetching sections:', error);
      },
    });
  }

  navigateToApplications(sectionId: number): void {
    this.router.navigate(['/admin/section', sectionId, 'applications']);
  }

  navigateToRoster(sectionId: number): void {
    this.router.navigate(['/admin/section', sectionId, 'roster']);
  }
}
