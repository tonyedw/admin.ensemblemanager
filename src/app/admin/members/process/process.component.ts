import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminMembersHttpApiService } from '../members.service';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
})
export class MemberProcessComponent implements OnInit {
  Id: string | null = null;
  userForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private apiService: AdminMembersHttpApiService,
    private fb: FormBuilder
  ) {
    // Initialize form with empty/default values
    this.userForm = this.fb.group({
      fName: [''],
      lName: [''],
      emails: [''],
      username: [''],
      password: [''],
      cellPhone: [''],
      address: [''],
      state: [''],
      city: [''],
    });
  }

  ngOnInit(): void {
    this.Id = this.route.snapshot.paramMap.get('id');
    if (this.Id) {
      this.getUser();
    }
  }

  getUser() {
    this.apiService.getMember(this.Id!).subscribe(
      (data) => {
        // Patch form with returned data
        this.userForm.patchValue(data[0]);
      },
      (error) => {
        console.error('Error fetching member:', error);
      }
    );
  }

  submit() {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value;
      // Call your service to save/update the user
      this.apiService.updateMember(updatedUser, this.Id ?? '').subscribe(
        (response) => {
          this.getUser();
          // You can add navigation or success message here
        },
        (error) => {
          console.error('Error updating member:', error);
        }
      );
    }
  }
}
