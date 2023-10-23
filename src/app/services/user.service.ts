import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

const USERS_URL_SNIPPET = '/rest/v1/users';

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
export class UserService {
  // private apiUrl = 'https://kvtpgtomhheyppcrztte.supabase.co/rest/v1/users';
  private apiUrl = environment.supabaseUrl + USERS_URL_SNIPPET;
  private supabase: SupabaseClient;


  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

/*   getUserObservable2(userId): Observable<any> {
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
  } */

  getUserObservable(userId): Observable<any> {
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

  getUserInfoAndCarrera(userId): Observable<any> {
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
