import { Component } from '@angular/core';
import { AdminMembersHttpApiService } from './members.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class MembersComponent {
  members: any[] = [];
  filteredMembers: any[] = [];

  searchID = '';
  searchFname = '';
  searchLname = '';
  searchUsername = '';
  searchEmail = '';

  // filteredValues = {
  //   id: '',
  //   fName: '',
  //   lName: '',
  //   email: '',
  //   username: '',
  // };

  constructor(
    private apiService: AdminMembersHttpApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers(): void {
    this.apiService.getMembers().subscribe(
      (data) => {
        this.members = data;
        this.filteredMembers = data;

        // this.searchID.valueChanges.subscribe((nameFilterValue) => {
        //   this.filteredValues['id'] = nameFilterValue ?? '';
        //   this.filteredMembers = this.performFiltering();
        // });

        // this.searchFname.valueChanges.subscribe((nameFilterValue) => {
        //   console.log('searchFname valueChanges', nameFilterValue);
        //   this.filteredValues['fName'] = nameFilterValue ?? '';
        //   this.filteredMembers = this.performFiltering();
        // });

        // this.searchLname.valueChanges.subscribe((nameFilterValue) => {
        //   this.filteredValues['lName'] = nameFilterValue ?? '';
        //   this.filteredMembers = this.performFiltering();
        // });

        // this.searchUsername.valueChanges.subscribe((nameFilterValue) => {
        //   this.filteredValues['username'] = nameFilterValue ?? '';
        //   this.filteredMembers = this.performFiltering();
        // });

        // this.searchEmail.valueChanges.subscribe((nameFilterValue) => {
        //   this.filteredValues['email'] = nameFilterValue ?? '';
        //   this.filteredMembers = this.performFiltering();
        // });
      },
      (error) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

  performFiltering(): any[] {
    // console.log(' performFiltering()');
    // const { id, fName, lName, username, email } = this.filteredValues;

    // const id = this.searchID.value;
    // const fName = this.searchFname.value;
    // const lName = this.searchLname.value;
    // const username = this.searchUsername.value;
    // const email = this.searchEmail.value;

    let filteredMembers = this.members;

    if (this.searchID) {
      filteredMembers = filteredMembers.filter(
        (member) => String(member.id) === String(this.searchID)
      );
    }

    if (this.searchFname) {
      filteredMembers = filteredMembers.filter((member) =>
        member.fName?.toLowerCase().includes(this.searchFname.toLowerCase())
      );
    }

    if (this.searchLname) {
      filteredMembers = filteredMembers.filter((member) =>
        member.lName?.toLowerCase().includes(this.searchLname.toLowerCase())
      );
    }

    if (this.searchUsername) {
      filteredMembers = filteredMembers.filter(
        (member) => member.username === this.searchUsername
      );
    }

    if (this.searchEmail) {
      filteredMembers = filteredMembers.filter(
        (item: any) =>
          Array.isArray(item.emails) &&
          item.emails.some((emailAddress: any) =>
            emailAddress.toLowerCase().includes(this.searchEmail.toLowerCase())
          )
      );
    }

    return filteredMembers;
  }

  delete(member: any, index: number): void {
    if (
      confirm(
        `Are you sure you want to delete ${member.fName} ${member.lName}?`
      )
    ) {
      this.apiService.deleteMember(member.id).subscribe({
        next: () => {
          this.filteredMembers.splice(index, 1);
        },
        error: (error) => {
          console.error('Error deleting member:', error);
        },
      });
    }
  }

  redirectProcess(id: number): void {
    this.router.navigate(['/admin/member', id]);
  }

  searchById(id: string): void {
    this.searchID = id;
    this.filteredMembers = this.performFiltering();
  }

  searchByFname(value: string): void {
    console.log('searchByFname', value);
    this.searchFname = value;
    this.filteredMembers = this.performFiltering();
  }

  searchByLname(value: string): void {
    this.searchLname = value;
    this.filteredMembers = this.performFiltering();
  }

  searchByUsername(value: string): void {
    this.searchUsername = value;
    this.filteredMembers = this.performFiltering();
  }

  searchByEmail(value: string): void {
    this.searchEmail = value;
    this.filteredMembers = this.performFiltering();
  }
}
