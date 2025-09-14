import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminAccountsHttpApiService } from '../accounts.service';
// import { AdminMembersHttpApiService } from '../members.service';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
})
export class AccountProcessComponent implements OnInit {
  Id: string | null = null;
  accountForm!: FormGroup;
  accountData: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: AdminAccountsHttpApiService,
    private fb: FormBuilder
  ) {
    // Initialize form with empty/default values
    this.accountForm = this.fb.group({
      name: [''],
      url: [''],
      payroll: [''],
      plot: [''],
      audition: [''],
      expiration: [''],
      ownerFname: [''],
      ownerLname: [''],
      ownerEmail: [''],
      autoDraft: [''],
      draftDay: [''],
    });
  }

  ngOnInit(): void {
    this.Id = this.route.snapshot.paramMap.get('id');
    if (this.Id) {
      this.getAccount();
    }
  }

  getAccount() {
    this.apiService.getAccount(this.Id!).subscribe(
      (data) => {
        // Patch form with returned data
        this.accountForm.patchValue(data[0]);
        this.accountData = data[0];
      },
      (error) => {
        console.error('Error fetching member:', error);
      }
    );
  }

  submit() {
    if (this.accountForm.valid) {
      const updatedAccount = this.accountForm.value;
      // Call your service to save/update the user
      this.apiService.updateAccount(updatedAccount, this.Id ?? '').subscribe(
        (response) => {
          this.getAccount();
          // You can add navigation or success message here
        },
        (error) => {
          console.error('Error updating member:', error);
        }
      );
    }
  }
}
