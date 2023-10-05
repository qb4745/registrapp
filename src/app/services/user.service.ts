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




  }

  getUserRolObservable(userId: string): Observable<number> {
    const url = `${this.apiUrl}?id=eq.${userId}&select=rol`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apiKey
    });

    return this.http.get<any[]>(url, { headers })
      .pipe(map(data => data[0].rol));
  }

  getUserDetailsObservable(userId: string): Observable<any> {
    const url = `${this.apiUrl}users?id=eq.${userId}&select=*`;

    // Set the headers including the API key
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apiKey
    });

    return this.http.get<any[]>(url, { headers: headers });
  }
  getUserCarrerraObservable(userId: string): Observable<any> {
    const url = `${this.apiUrl}carreras?select=nombre_carrera&select=*,users(id=eq.${userId}),carreras(*)`;
    console.log('url getUserCarrerraObservable:', url);
    // Set the headers including the API key
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apiKey
    });

    return this.http.get<any[]>(url, { headers: headers });
  }

  async getUserRol(userId: string): Promise<number> {
    const url = `${this.apiUrl}users?id=eq.${userId}&select=rol`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apiKey
    });

    try {
      const data = await this.http.get<any[]>(url, { headers }).toPromise();
      const firstItem = data[0];
      return firstItem ? firstItem.rol : null; // Return null if no data or undefined
    } catch (error) {
      // Handle errors here (e.g., log the error, show a user-friendly message)
      console.error('Error fetching user rol:', error);
      throw error; // Rethrow the error to the caller if needed
    }
  }







}
