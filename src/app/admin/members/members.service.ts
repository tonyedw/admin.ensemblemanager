import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminMembersHttpApiService {
  apiURL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMembers(): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/members/get.list.php`;
    return this.http.get(API_URL);
  }

  getMember(id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/members/get.php?id=${id}`;
    return this.http.get(API_URL);
  }

  deleteMember(id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/members/delete.php?id=${id}`;
    return this.http.get(API_URL);
  }

  updateMember(data: any, id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/members/process.php?id=${id}`;

    return this.http
      .post<any>(API_URL, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        catchError((err: any) => {
          return JSON.parse(err.message);
        })
      );
  }
}
