import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminNewsletterHttpApiService {
  apiURL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAccounts(): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/email/newsletter.php`;

    return this.http.get(API_URL);
  }

  uploadEmailImage(formData: FormData): Observable<any> {
    // Updated to use your upload.php file in the images folder
    const API_URL = `https://${this.apiURL}/api/management/email/images/upload.php`;

    // Add any required headers here if authentication is needed
    const headers = new HttpHeaders({
      // Don't set Content-Type for FormData - let browser set it with boundary
      // 'Authorization': 'Bearer ' + token, // Add if needed
    });

    return this.http.post<any>(API_URL, formData, { headers }).pipe(
      catchError((err: any) => {
        console.error('Upload error details:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error response:', err.error);
        console.error('Full error object:', err);
        throw err;
      })
    );
  }

  // // Test method to check API connectivity
  // testApiConnectivity(): Observable<any> {
  //   const API_URL = `https://${this.apiURL}/api/management/accounts/get.list.php`;
  //   console.log('Testing API connectivity to:', API_URL);

  //   return this.http.get(API_URL).pipe(
  //     catchError((err: any) => {
  //       console.error('API connectivity test failed:', err);
  //       throw err;
  //     })
  //   );
  // }

  sendEmailToAccounts(emailData: any): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/email/send.php`;

    return this.http
      .post<any>(API_URL, emailData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        catchError((err: any) => {
          throw err;
        })
      );
  }
}
