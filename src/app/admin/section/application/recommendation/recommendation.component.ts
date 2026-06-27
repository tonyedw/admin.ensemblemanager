import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdminSectionHttpApiService } from '../../section.service';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss'],
})
export class RecommendationComponent implements OnInit {
  @Input() applicationId: string | null = null;

  recommendationForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: AdminSectionHttpApiService
  ) {}

  ngOnInit(): void {
    this.recommendationForm = this.fb.group({
      recommenderName: ['', [Validators.required]],
      recommenderEmail: ['', [Validators.required, Validators.email]],
      recommenderTitle: ['', [Validators.required]],
      relationship: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(50)]],
    });

    if (this.applicationId) {
      this.loadRecommendation();
    }
  }

  loadRecommendation(): void {
    this.isLoading = true;
    this.apiService.getRecommendation(this.applicationId!).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data) {
          this.recommendationForm.patchValue(data);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading recommendation:', error);
      },
    });
  }

  submit(): void {
    if (this.recommendationForm.invalid || !this.applicationId) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService
      .updateRecommendation(this.recommendationForm.value, this.applicationId)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.successMessage = 'Recommendation saved successfully.';
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = 'Failed to save recommendation. Please try again.';
          console.error('Error saving recommendation:', error);
        },
      });
  }

  getFieldError(field: string): string {
    const control = this.recommendationForm.get(field);
    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Please enter a valid email address.';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Must be at least ${min} characters.`;
    }
    return '';
  }
}
