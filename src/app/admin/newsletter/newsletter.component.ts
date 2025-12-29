import { Component } from '@angular/core';
import { AdminNewsletterHttpApiService } from './newsletter.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, QuillModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
})
export class NewsletterComponent {
  accounts: any[] = [];
  total = 0;
  selectedAccounts: Set<number> = new Set();
  selectAll = false;
  showEmailComposer = false;
  emailForm: FormGroup;
  isUploading = false;
  quillEditor: any = null;

  // Quill editor configuration
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image'],
      ],
      handlers: {
        image: () => this.imageHandler(),
      },
    },
  };

  constructor(
    private apiService: AdminNewsletterHttpApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.emailForm = this.fb.group({
      subject: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAccounts();
    // Test API connectivity when component loads
    // this.testApiConnectivity();
  }

  // testApiConnectivity(): void {
  //   this.apiService.testApiConnectivity().subscribe({
  //     next: (response) => {
  //       console.log('API connectivity test successful:', response);
  //     },
  //     error: (error) => {
  //       console.error('API connectivity test failed:', error);
  //     },
  //   });
  // }

  getAccounts(): void {
    this.apiService.getAccounts().subscribe(
      (data) => {
        this.accounts = data;
        this.getTotal();
      },
      (error) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

  getTotal() {
    this.accounts.map((data) => {
      this.total +=
        data.prices.basePrice +
        data.prices.payrollPrice +
        data.prices.plotPrice;
    });
  }

  redirectProcess(id: number): void {
    this.router.navigate(['/admin/account', id]);
  }

  expirationColor(date: string, renew: number): string {
    const currentDate = new Date();
    const expirationDate = new Date(date);
    const diff = expirationDate.getTime() - currentDate.getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    if (diff <= oneWeek && renew === 0) {
      return 'red';
    } else if (diff <= oneMonth && renew === 0) {
      return 'orange';
    } else {
      return '';
    }
  }

  // Checkbox functionality
  onSelectAll(event: any): void {
    this.selectAll = event.target.checked;
    if (this.selectAll) {
      this.selectedAccounts = new Set(this.accounts.map((account) => account));
    } else {
      this.selectedAccounts.clear();
    }
  }

  onAccountSelect(account: any, event: any): void {
    if (event.target.checked) {
      this.selectedAccounts.add(account);
    } else {
      this.selectedAccounts.delete(account);
    }

    // Update select all checkbox state
    this.selectAll = this.selectedAccounts.size === this.accounts.length;
  }

  isAccountSelected(account: any): boolean {
    return this.selectedAccounts.has(account);
  }

  // Email composer functionality
  openEmailComposer(): void {
    if (this.selectedAccounts.size === 0) {
      alert('Please select at least one account to send email to.');
      return;
    }

    // Pre-populate email body with signature
    this.emailForm.patchValue({
      body: this.getEmailSignature(),
    });

    this.showEmailComposer = true;
  }

  closeEmailComposer(): void {
    this.showEmailComposer = false;
    this.emailForm.reset();
  }

  getEmailSignature(): string {
    return `<br><br><hr><p><strong>Tony Edwards</strong><br>tony@ensemblemanager.com</p>`;
  }

  imageHandler(): void {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        this.uploadImage(file);
      }
    };
  }

  uploadImage(file: File): void {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', file);

    this.apiService.uploadEmailImage(formData).subscribe({
      next: (response: any) => {
        console.log('Upload successful:', response);
        this.isUploading = false;
        const imageUrl = `https://api.ensemblemanager.com/api/management/email/images/${response.filename}`;
        this.insertImageIntoEditor(imageUrl);
      },
      error: (error: any) => {
        this.isUploading = false;
        console.error('Error uploading image:', error);

        let errorMessage = 'Failed to upload image. ';
        if (error.status === 0) {
          errorMessage += 'Network error - check if the server is accessible.';
        } else if (error.status === 404) {
          errorMessage += 'Upload endpoint not found (404).';
        } else if (error.status === 413) {
          errorMessage += 'File too large.';
        } else if (error.status === 415) {
          errorMessage += 'Unsupported file type.';
        } else if (error.status >= 500) {
          errorMessage += 'Server error.';
        } else {
          errorMessage += `Server responded with status ${error.status}.`;
        }

        alert(errorMessage + ' Please try again.');
      },
    });
  }

  insertImageIntoEditor(imageUrl: string): void {
    if (this.quillEditor) {
      const range = this.quillEditor.getSelection(true);
      this.quillEditor.insertEmbed(range.index, 'image', imageUrl);
    }
  }

  onEditorCreated(quill: any): void {
    this.quillEditor = quill;
  }

  sendEmail(): void {
    if (this.emailForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    if (this.selectedAccounts.size === 0) {
      alert('Please select at least one account to send email to.');
      return;
    }

    const emailData = {
      list: Array.from(this.selectedAccounts),
      message: this.emailForm.get('body')?.value,
      subject: this.emailForm.get('subject')?.value,
    };

    this.apiService.sendEmailToAccounts(emailData).subscribe({
      next: (response: any) => {
        console.log(response);
        alert('Emails sent successfully!');
        this.closeEmailComposer();
        this.selectedAccounts.clear();
        this.selectAll = false;
      },
      error: (error: any) => {
        console.error('Error sending emails:', error);
        alert('Failed to send emails. Please try again.');
      },
    });
  }

  getSelectedAccountsCount(): number {
    return this.selectedAccounts.size;
  }
}
