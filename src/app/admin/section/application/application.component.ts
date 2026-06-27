import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdminSectionHttpApiService } from '../section.service';
import { FilesComponent } from './files/files.component';
import { RecommendationComponent } from './recommendation/recommendation.component';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FilesComponent,
    RecommendationComponent,
  ],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit {
  applicationId: string | null = null;
  sectionId: string | null = null;
  applicationForm!: FormGroup;
  applicationData: any;
  isLoading = false;
  isSaving = false;
  isEditMode = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: AdminSectionHttpApiService
  ) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id');
    this.sectionId = this.route.snapshot.paramMap.get('sectionId');

    this.applicationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      instrument: ['', [Validators.required]],
      experience: [''],
      notes: [''],
      status: ['pending'],
    });

    if (this.applicationId) {
      this.loadApplication();
    }
  }

  loadApplication(): void {
    this.isLoading = true;
    this.apiService.getApplication(this.applicationId!).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.applicationData = Array.isArray(data) ? data[0] : data;
        this.applicationForm.patchValue(this.applicationData);
        this.applicationForm.disable();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading application:', error);
      },
    });
  }

  enableEdit(): void {
    this.isEditMode = true;
    this.applicationForm.enable();
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.applicationForm.patchValue(this.applicationData);
    this.applicationForm.disable();
  }

  submit(): void {
    if (this.applicationForm.invalid || !this.applicationId) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService
      .updateApplication(this.applicationForm.value, this.applicationId)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.successMessage = 'Application saved successfully.';
          this.isEditMode = false;
          this.applicationForm.disable();
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = 'Failed to save application. Please try again.';
          console.error('Error saving application:', error);
        },
      });
  }

  getFieldError(field: string): string {
    const control = this.applicationForm.get(field);
    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Please enter a valid email address.';
    return '';
  }
}
