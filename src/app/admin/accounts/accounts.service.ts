import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminAccountsHttpApiService {
  apiURL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAccounts(): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/accounts/get.list.php`;

    return this.http.get(API_URL);
  }

  getAccount(id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/accounts/get.php?id=${id}`;

    return this.http.get(API_URL);
  }

  deleteAccount(id: number): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/accounts/delete.php?id=${id}`;

    return this.http.get(API_URL);
  }

  updateAccount(data: any, id: string): Observable<any> {
    const API_URL = `https://${this.apiURL}/api/management/accounts/process.php?id=${id}`;

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
