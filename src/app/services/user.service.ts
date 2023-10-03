import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://qzhofresgxsiyccsjsbi.supabase.co/rest/v1/users';

  // Replace 'YOUR_API_KEY' with your actual Supabase API key
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6aG9mcmVzZ3hzaXljY3Nqc2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU1MzYyODYsImV4cCI6MjAxMTExMjI4Nn0.pVpVXht2sD2EMKPG3CX0jkqiQO_mXcFPBBgnqt6yKIs';

  constructor(private http: HttpClient) { }

  getUserRolObservable(userId: string): Observable<number> {
    const url = `${this.apiUrl}?id=eq.${userId}&select=rol`;

    // Set the headers including the API key
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apiKey
    });

    return this.http.get<any[]>(url, { headers: headers })
      .pipe(map(data => data[0].rol));
  }

  getUserDetailsObservable(userId: string): Observable<any> {
    const url = `${this.apiUrl}?id=eq.${userId}&select=*`;

    // Set the headers including the API key
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apiKey
    });

    return this.http.get<any[]>(url, { headers: headers });
  }
}