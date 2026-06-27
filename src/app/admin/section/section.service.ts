import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminSectionHttpApiService {
  apiURL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getSections(accountId: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/sections/get.list.php?accountId=${accountId}`;
    return this.http.get(API_URL);
  }

  getSection(id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/sections/get.php?id=${id}`;
    return this.http.get(API_URL);
  }

  getApplications(sectionId: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/sections/applications/get.list.php?sectionId=${sectionId}`;
    return this.http.get(API_URL);
  }

  getApplication(id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/sections/applications/get.php?id=${id}`;
    return this.http.get(API_URL);
  }

  updateApplication(data: any, id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/sections/applications/process.php?id=${id}`;
    return this.http
      .post<any>(API_URL, data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        catchError((err: any) => {
          throw err;
        })
      );
  }

  getRecommendation(applicationId: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/sections/recommendations/get.php?applicationId=${applicationId}`;
    return this.http.get(API_URL);
  }

  updateRecommendation(data: any, applicationId: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/sections/recommendations/process.php?applicationId=${applicationId}`;
    return this.http
      .post<any>(API_URL, data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        catchError((err: any) => {
          throw err;
        })
      );
  }

  getRoster(sectionId: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/sections/roster/get.list.php?sectionId=${sectionId}`;
    return this.http.get(API_URL);
  }

  getRepertoire(sectionId: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/sections/roster/repertoire.php?sectionId=${sectionId}`;
    return this.http.get(API_URL);
  }

  uploadFile(applicationId: string, formData: FormData): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/sections/applications/upload.php?applicationId=${applicationId}`;
    return this.http.post<any>(API_URL, formData).pipe(
      catchError((err: any) => {
        throw err;
      })
    );
  }
}
