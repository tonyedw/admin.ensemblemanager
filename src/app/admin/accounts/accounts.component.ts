import { Component } from '@angular/core';
import { AdminAccountsHttpApiService } from './accounts.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent {
  accounts: any[] = [];
  total = 0;

  constructor(
    private apiService: AdminAccountsHttpApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(): void {
    this.apiService.getAccounts().subscribe(
      (data) => {
        this.accounts = data;
        this.getTotal();
      },
      (error) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

  getTotal() {
    this.accounts.map((data) => {
      this.total +=
        data.prices.basePrice +
        data.prices.payrollPrice +
        data.prices.plotPrice;
    });
  }

  redirectProcess(id: number): void {
    this.router.navigate(['/admin/account', id]);
  }

  delete(account: any, index: number): void {
    if (confirm(`Are you sure you want to delete ${account.name}`)) {
      this.apiService.deleteAccount(account.id).subscribe({
        next: () => {
          this.accounts.splice(index, 1);
        },
        error: (error) => {
          console.error('Error deleting member:', error);
        },
      });
    }
  }

  expirationColor(date: string, renew: number): string {
    const currentDate = new Date();
    const expirationDate = new Date(date);
    const diff = expirationDate.getTime() - currentDate.getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    if (diff <= oneWeek && renew === 0) {
      return 'red';
    } else if (diff <= oneMonth && renew === 0) {
      return 'orange';
    } else {
      return '';
    }
  }
}
