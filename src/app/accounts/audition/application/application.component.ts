import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuditionService } from '../audition.service';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss',
})
export class ApplicationComponent implements OnInit {
  applicationForm!: FormGroup;
  isEditMode = false;
  applicationId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private auditionService: AuditionService
  ) {}

  ngOnInit(): void {
    this.applicationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      instrument: ['', Validators.required],
      section: ['', Validators.required],
      experience: ['', Validators.required],
      notes: [''],
    });
  }

  enableEditMode(id: string): void {
    this.isEditMode = true;
    this.applicationId = id;
    this.isLoading = true;

    this.auditionService.getApplication(id).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        this.applicationForm.patchValue(data);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.submitError = error?.message ?? 'Failed to load application.';
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.applicationForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(field: string): string {
    const control = this.applicationForm.get(field);
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address.';
    }
    return 'Invalid value.';
  }

  submit(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const request$ = this.isEditMode && this.applicationId
      ? this.auditionService.updateApplication(this.applicationForm.value, this.applicationId)
      : this.auditionService.submitApplication(this.applicationForm.value);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        if (!this.isEditMode) {
          this.applicationForm.reset();
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.submitError = error?.message ?? 'Submission failed. Please try again.';
      },
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.applicationId = null;
    this.applicationForm.reset();
    this.submitSuccess = false;
    this.submitError = '';
  }
}
