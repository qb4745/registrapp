import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

const USERS_URL_SNIPPET = '/rest/v1/profesores';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apaterno: string;
  amaterno: string;
  carrera_id: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = environment.supabaseUrl + USERS_URL_SNIPPET;
  private supabase: SupabaseClient;


  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }


  getProfesorInfo(userId): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Range': '0-9'
    });

    const params = {
      id: `eq.${userId}`,
      select: '*'
    };

    return this.http.get<any>(this.apiUrl, { headers, params });
  }






}