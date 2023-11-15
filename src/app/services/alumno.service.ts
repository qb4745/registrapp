import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

const USERS_URL_SNIPPET = '/rest/v1/alumnos';

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
export class AlumnoService {
  private apiUrl = environment.supabaseUrl + USERS_URL_SNIPPET;
  private supabase: SupabaseClient;


  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }



  getAlumnoInfo(userId): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
    });

    const params = {
      id: `eq.${userId}`,
      select: '*'
    };

    return this.http.get<any>(this.apiUrl, { headers, params });
  }

  checkIfAlumnoExist(userId: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
    });

    const params = {
      id: `eq.${userId}`,
      select: '*'
    };

    return this.http.get<any>(`${this.apiUrl}`, { headers, params })
      .pipe(
        map(response => {
          return response.length > 0;
        })
      );
  }

  getAlumnoInfoAndCarrera(userId): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Range': '0-9'
    });

    const params = {
      id: `eq.${userId}`,
      select: '*,carreras(nombre_carrera)'
    };

    return this.http.get<any>(this.apiUrl, { headers, params });
  }


}
