import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditionService } from '../audition.service';

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roster.component.html',
  styleUrl: './roster.component.scss',
})
export class RosterComponent implements OnInit {
  roster: any[] = [];
  filteredRoster: any[] = [];
  isLoading = false;
  loadError = '';
  searchSection = '';
  searchName = '';

  constructor(private auditionService: AuditionService) {}

  ngOnInit(): void {
    this.getRoster();
  }

  getRoster(): void {
    this.isLoading = true;
    this.loadError = '';

    this.auditionService.getRoster().subscribe({
      next: (data: any[]) => {
        this.isLoading = false;
        this.roster = data ?? [];
        this.filteredRoster = this.roster;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.loadError = error?.message ?? 'Failed to load roster.';
      },
    });
  }

  filterBySection(value: string): void {
    this.searchSection = value;
    this.applyFilters();
  }

  filterByName(value: string): void {
    this.searchName = value;
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = this.roster;

    if (this.searchSection) {
      result = result.filter((member) =>
        member.section?.toLowerCase().includes(this.searchSection.toLowerCase())
      );
    }

    if (this.searchName) {
      result = result.filter(
        (member) =>
          member.firstName?.toLowerCase().includes(this.searchName.toLowerCase()) ||
          member.lastName?.toLowerCase().includes(this.searchName.toLowerCase())
      );
    }

    this.filteredRoster = result;
  }
}
