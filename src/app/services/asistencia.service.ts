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
/*   [
    {
        "id": "ad5ea2cd-d6ea-4c0a-8656-1a8e1898af9c",
        "email": "combustion.1@gmail.com",
        "nombre": "jaime",
        "apaterno": "vicencio",
        "amaterno": "rubilar",
        "carrera_id": 1,
        "rol": 1,
        "carreras": {
            "nombre_carrera": "Ingeniería en Informática"
        }
    }
] */



}
