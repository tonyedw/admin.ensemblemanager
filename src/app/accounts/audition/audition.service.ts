import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuditionService {
  apiURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/files/upload.php`;
    return this.http.post<any>(API_URL, formData);
  }

  getApplications(): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/applications/get.list.php`;
    return this.http.get(API_URL);
  }

  getApplication(id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/applications/get.php?id=${encodeURIComponent(id)}`;
    return this.http.get(API_URL);
  }

  submitApplication(data: any): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/applications/submit.php`;
    return this.http.post<any>(API_URL, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  updateApplication(data: any, id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/applications/process.php?id=${encodeURIComponent(id)}`;
    return this.http.post<any>(API_URL, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getRecommendations(applicationId: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/recommendations/get.list.php?applicationId=${encodeURIComponent(applicationId)}`;
    return this.http.get(API_URL);
  }

  submitRecommendation(data: any): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/recommendations/submit.php`;
    return this.http.post<any>(API_URL, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getRoster(): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/roster/get.list.php`;
    return this.http.get(API_URL);
  }
}
