import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

const ASISTENCIA_URL_SNIPPET = '/rest/v1/asistencias';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = environment.supabaseUrl + ASISTENCIA_URL_SNIPPET;
  private supabase: SupabaseClient;


  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getUserAsistenciaDetails(asistenciaId): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Range': '0-9'
    });

    const params = {
      id: `eq.${asistenciaId}`,
      select: '*'
    };

    return this.http.get<any>(this.apiUrl, { headers, params });
  }
  getUserAsistenciaNestedJoinsDetails(asistenciaId: string): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Range': '0-9'
    });

    const params = {
      id: `eq.${asistenciaId}`,
      select: '*,clases(*,secciones(*,profesores(*),asignaturas(*,carreras(*,alumnos(*))))))'
    };

    return this.http.get<any>(`${this.apiUrl}`, { headers, params });
  }

  updateAsistioStatusToTrue(asistenciaId: string): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Content-Type': 'application/json' // Specify content type for PATCH request
    });

    const body = {
      asistio: true
    };

    const params = {
      id: `eq.${asistenciaId}`
    };

    return this.http.patch<any>(`${this.apiUrl}`, body, { headers, params });
  }
  updateAsistioStatusToFalse(asistenciaId: string): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Content-Type': 'application/json' // Specify content type for PATCH request
    });

    const body = {
      asistio: false
    };

    const params = {
      id: `eq.${asistenciaId}`
    };

    return this.http.patch<any>(`${this.apiUrl}`, body, { headers, params });
  }
}
