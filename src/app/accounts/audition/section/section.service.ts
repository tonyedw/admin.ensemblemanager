import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  apiURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSections(): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/sections/get.list.php`;
    return this.http.get(API_URL);
  }

  getSection(id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/sections/get.php?id=${encodeURIComponent(id)}`;
    return this.http.get(API_URL);
  }

  createSection(data: any): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/sections/create.php`;
    return this.http.post<any>(API_URL, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  updateSection(data: any, id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/sections/process.php?id=${encodeURIComponent(id)}`;
    return this.http.post<any>(API_URL, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  deleteSection(id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/audition/sections/delete.php?id=${encodeURIComponent(id)}`;
    return this.http.delete<any>(API_URL);
  }
}
