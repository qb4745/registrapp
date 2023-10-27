import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Clase } from '../interfaces/clase.interface';

const SECCIONES_URL_SNIPPET = '/rest/v1/secciones';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private apiUrlSecciones = environment.supabaseUrl + SECCIONES_URL_SNIPPET;
  private supabase: SupabaseClient;


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }



  getProfesorClasesListAll(profesorId: string): Observable<Clase[]> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Range': '0-9'
    });

    const params = {
      profesor_id: `eq.${profesorId}`,
      select: '*,clases(*)' // Include clases(*) in the select query to get class information for each section
    };

    return this.http.get<any[]>(`${this.apiUrlSecciones}`, { headers, params }).pipe(
      map(response => {
        // Map the response data to create the desired structure
        const clases: Clase[] = [];

        response.forEach(section => {
          section.clases.forEach(clase => {
            clases.push({
              id: clase.id,
              fecha: clase.fecha,
              hora_inicio: clase.hora_inicio,
              hora_termino: clase.hora_termino,
              seccion_id: clase.seccion_id,
              nombre_seccion: section.nombre_seccion,
              profesor_id: section.profesor_id,
              asignatura_id: section.asignatura_id
            });
          });
        });

        return clases;
      })
    );
  }

  getProfesorClasesListCurrentDay(profesorId: string): Observable<Clase[]> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
      'Range': '0-9'
    });

    const params = {
      profesor_id: `eq.${profesorId}`,
      select: '*,clases(*)' // Include clases(*) in the select query to get class information for each section
    };

    return this.http.get<any[]>(`${this.apiUrlSecciones}`, { headers, params }).pipe(
      tap(response => console.log('API Response:', response)),
      map(response => {
        // Map the response data to create the desired structure
        const currentDate = new Date();


        const clases: Clase[] = [];

        response.forEach(section => {
          section.clases.forEach(clase => {
            const classDate = new Date(clase.fecha);
            if (
              // clase.fecha == currentDate.toISOString().slice(0, 10)
              clase.fecha == "2023-10-27"
            ) {
              // Compare only the date portion of the datetime
              clases.push({
                id: clase.id,
                fecha: clase.fecha,
                hora_inicio: clase.hora_inicio,
                hora_termino: clase.hora_termino,
                seccion_id: clase.seccion_id,
                nombre_seccion: section.nombre_seccion,
                profesor_id: section.profesor_id,
                asignatura_id: section.asignatura_id
              });
            }
          });
        });

        return clases;
      })
    );
  }


}

