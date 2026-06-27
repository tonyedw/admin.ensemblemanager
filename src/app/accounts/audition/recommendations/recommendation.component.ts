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
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.scss',
})
export class RecommendationComponent implements OnInit {
  recommendationForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private auditionService: AuditionService
  ) {}

  ngOnInit(): void {
    this.recommendationForm = this.fb.group({
      recommenderName: ['', [Validators.required, Validators.minLength(2)]],
      recommenderEmail: ['', [Validators.required, Validators.email]],
      recommenderTitle: ['', Validators.required],
      recommenderOrganization: ['', Validators.required],
      relationship: ['', Validators.required],
      recommendation: ['', [Validators.required, Validators.minLength(50)]],
      applicantName: ['', Validators.required],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.recommendationForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(field: string): string {
    const control = this.recommendationForm.get(field);
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address.';
    }
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Must be at least ${min} characters.`;
    }
    return 'Invalid value.';
  }

  submit(): void {
    if (this.recommendationForm.invalid) {
      this.recommendationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.auditionService.submitRecommendation(this.recommendationForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.recommendationForm.reset();
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.submitError = error?.message ?? 'Submission failed. Please try again.';
      },
    });
  }
}
