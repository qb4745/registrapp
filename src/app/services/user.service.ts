import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/UserModel';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { IUser } from '../models/IUser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase: SupabaseClient;
  private currentUser: BehaviorSubject<User | boolean> = new BehaviorSubject(null);

  private apiUrl = environment.supabaseApiUrl;
  private apiKey = environment.supabaseKey;
  private userDetails: UserModel;


  constructor(private http: HttpClient, private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);



/*     this.loadUser();
    const userId = this.getCurrentUserId();
    this.getUserDetailsObservable(userId); */


  }

/*   async loadUser() {
    if (this.currentUser.value) {
      return;
    }

    const user = await this.supabase.auth.getUser();

    if (user.data.user) {
      this.currentUser.next(user.data.user);
    } else {
      this.currentUser.next(false);
    }

  } */

/*   getCurrentUser(): Observable<User | boolean> {
    return this.currentUser.asObservable();
  }

  getCurrentUserId(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id;
    } else {
      return null;
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apiKey
    });
  }

  private handleResponse(response: any): any {
    return response[0]; // Modify this based on your API response structure
  }

  getUserDetailsFromPublicTable(userId: string): UserModel {
    return this.userDetails;
  }

  getUserRolObservable(userId: string): Observable<number> {
    const url = `${this.apiUrl}?id=eq.${userId}&select=rol`;
    const headers = this.getHeaders();

    return this.http.get<any[]>(url, { headers })
      .pipe(map(data => data[0].rol));
  } */

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
