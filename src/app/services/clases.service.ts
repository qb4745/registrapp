import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

const SECCIONES_URL_SNIPPET = '/rest/v1/secciones';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private apiUrlSecciones = environment.supabaseUrl + SECCIONES_URL_SNIPPET;
  private supabase: SupabaseClient;


  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getProfesorClasesList(profesorId: string): Observable<any> {
      const headers = new HttpHeaders({
        'apikey': environment.supabaseKey,
        'Authorization': `Bearer ${environment.supabaseKey}`,
        'Range': '0-9'
      });

      const params = {
        profesor_id: `eq.${profesorId}`,
        select: '*,clases(*)'
      };

      return this.http.get<any>(`${this.apiUrlSecciones}`, { headers, params });
  }





}