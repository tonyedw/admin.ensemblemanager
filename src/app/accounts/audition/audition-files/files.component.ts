import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditionService } from '../audition.service';

@Component({
  selector: 'app-audition-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
})
export class FilesComponent {
  mediaType: 'audio' | 'video' | null = null;
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  uploadSuccess = false;
  uploadError = '';
  private uploadSubscription: any = null;

  constructor(private auditionService: AuditionService) {}

  selectMediaType(type: 'audio' | 'video'): void {
    if (this.mediaType === type) {
      this.mediaType = null;
      this.selectedFile = null;
      this.uploadSuccess = false;
      this.uploadError = '';
    } else {
      this.mediaType = type;
      this.selectedFile = null;
      this.uploadSuccess = false;
      this.uploadError = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.uploadError = '';
      this.uploadSuccess = false;
    }
  }

  get acceptTypes(): string {
    if (this.mediaType === 'audio') {
      return 'audio/*';
    }
    if (this.mediaType === 'video') {
      return 'video/*';
    }
    return '';
  }

  upload(): void {
    if (!this.selectedFile || !this.mediaType) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadError = '';
    this.uploadSuccess = false;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('type', this.mediaType);

    this.uploadSubscription = this.auditionService.uploadFile(formData).subscribe({
      next: () => {
        this.isUploading = false;
        this.uploadSuccess = true;
        this.selectedFile = null;
        this.uploadSubscription = null;
      },
      error: (error: any) => {
        this.isUploading = false;
        this.uploadError = error?.message ?? 'Upload failed. Please try again.';
        this.uploadSubscription = null;
      },
    });
  }

  cancelUpload(): void {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
      this.uploadSubscription = null;
    }
    this.isUploading = false;
    this.uploadProgress = 0;
    this.uploadError = '';
  }

  clearSelection(): void {
    this.mediaType = null;
    this.selectedFile = null;
    this.uploadSuccess = false;
    this.uploadError = '';
  }
}
