import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AdminSectionHttpApiService } from '../section.service';

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss'],
})
export class RosterComponent implements OnInit {
  sectionId: string | null = null;
  roster: any[] = [];
  repertoire: any[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: AdminSectionHttpApiService
  ) {}

  ngOnInit(): void {
    this.sectionId = this.route.snapshot.paramMap.get('sectionId');
    if (this.sectionId) {
      this.loadRoster();
      this.loadRepertoire();
    }
  }

  loadRoster(): void {
    this.isLoading = true;
    this.apiService.getRoster(this.sectionId!).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.roster = data;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching roster:', error);
      },
    });
  }

  loadRepertoire(): void {
    this.apiService.getRepertoire(this.sectionId!).subscribe({
      next: (data) => {
        this.repertoire = data;
      },
      error: (error) => {
        console.error('Error fetching repertoire:', error);
      },
    });
  }
}
