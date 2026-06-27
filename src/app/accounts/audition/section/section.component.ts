import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SectionService } from './section.service';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
})
export class SectionComponent implements OnInit {
  sections: any[] = [];
  sectionForm!: FormGroup;
  isEditMode = false;
  editId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  loadError = '';
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private sectionService: SectionService
  ) {}

  ngOnInit(): void {
    this.sectionForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    this.getSections();
  }

  getSections(): void {
    this.isLoading = true;
    this.loadError = '';

    this.sectionService.getSections().subscribe({
      next: (data: any[]) => {
        this.isLoading = false;
        this.sections = data ?? [];
      },
      error: (error: any) => {
        this.isLoading = false;
        this.loadError = error?.message ?? 'Failed to load sections.';
      },
    });
  }

  edit(section: any): void {
    this.isEditMode = true;
    this.editId = section.id;
    this.sectionForm.patchValue({
      name: section.name,
      description: section.description ?? '',
    });
    this.submitError = '';
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editId = null;
    this.sectionForm.reset();
    this.submitError = '';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.sectionForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submit(): void {
    if (this.sectionForm.invalid) {
      this.sectionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const request$ = this.isEditMode && this.editId
      ? this.sectionService.updateSection(this.sectionForm.value, this.editId)
      : this.sectionService.createSection(this.sectionForm.value);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cancelEdit();
        this.getSections();
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.submitError = error?.message ?? 'Save failed. Please try again.';
      },
    });
  }

  delete(section: any): void {
    if (!confirm(`Delete section "${section.name}"?`)) {
      return;
    }

    this.sectionService.deleteSection(section.id).subscribe({
      next: () => {
        this.getSections();
      },
      error: (error: any) => {
        this.loadError = error?.message ?? 'Delete failed.';
      },
    });
  }
}
