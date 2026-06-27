import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminSectionHttpApiService } from '../../section.service';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnChanges {
  @Input() applicationId: string | null = null;
  @Input() disabled = false;

  fileType: string | null = null;
  selectedFile: File | null = null;
  isUploading = false;
  uploadedFiles: any[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(private apiService: AdminSectionHttpApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && changes['disabled'].currentValue) {
      this.clearSelection();
    }
  }

  get acceptedTypes(): string {
    if (this.fileType === 'audio') return 'audio/*';
    if (this.fileType === 'video') return 'video/*';
    return '';
  }

  get isUploadDisabled(): boolean {
    return this.disabled || !this.fileType || !this.selectedFile || this.isUploading;
  }

  clearSelection(): void {
    this.fileType = null;
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = '';
    } else {
      this.selectedFile = null;
    }
  }

  uploadFile(): void {
    if (!this.selectedFile || !this.fileType || !this.applicationId) return;

    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('fileType', this.fileType);

    this.apiService.uploadFile(this.applicationId, formData).subscribe({
      next: (response: any) => {
        this.isUploading = false;
        this.successMessage = 'File uploaded successfully.';
        this.clearSelection();
        if (response?.files) {
          this.uploadedFiles = response.files;
        }
      },
      error: (error: any) => {
        this.isUploading = false;
        this.errorMessage = 'Failed to upload file. Please try again.';
        console.error('Error uploading file:', error);
      },
    });
  }
}
