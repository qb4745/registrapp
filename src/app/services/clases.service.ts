import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Clase } from '../interfaces/clase.interface';

const SECCIONES_URL_SNIPPET = '/rest/v1/secciones';
const SECCIONES_ALUMNOS_URL_SNIPPET = '/rest/v1/secciones_alumnos';
const CLASES_URL_SNIPPET = '/rest/v1/clases';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private apiUrlSecciones = environment.supabaseUrl + SECCIONES_URL_SNIPPET;
  private apiUrlSeccionesAlumnos = environment.supabaseUrl + SECCIONES_ALUMNOS_URL_SNIPPET;
  private apiUrlClases = environment.supabaseUrl + CLASES_URL_SNIPPET;
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
      select: '*,clases(*)'
    };

    return this.http.get<any[]>(`${this.apiUrlSecciones}`, { headers, params }).pipe(
      map(response => {
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

  getProfesorClasesListCurrentDay(profesorId: string, fechaDeHoy: string): Observable<Clase[]> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
    });

    const params = {
      profesor_id: `eq.${profesorId}`,
      select: '*,clases(*)'
    };

    return this.http.get<any[]>(`${this.apiUrlSecciones}`, { headers, params }).pipe(
      tap(response => console.log('API Response:', response)),
      map(response => {
        const currentDate = new Date();


        const clases: Clase[] = [];

        response.forEach(section => {
          section.clases.forEach(clase => {
            const classDate = new Date(clase.fecha);
            if (
              // clase.fecha == currentDate.toISOString().slice(0, 10)
              // clase.fecha == "2023-10-28"
              clase.fecha == fechaDeHoy
            ) {
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

  getgetAlumnosBySeccion(seccionId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
    });

    const params = {
      seccion_id: `eq.${seccionId}`,
      select: '*,alumnos(*)'
    };

    return this.http.get<any[]>(`${this.apiUrlSeccionesAlumnos}`, { headers, params });
  }


  getClasesAndSeccionbyFecha(fechaDeHoy: string): Observable<Clase[]> {
    const headers = new HttpHeaders({
      'apikey': environment.supabaseKey,
      'Authorization': `Bearer ${environment.supabaseKey}`,
    });

    const params = {
      fecha: `eq.${fechaDeHoy}`,
      select: '*,seccion_id(*)'
    };

    return this.http.get<any[]>(this.apiUrlClases, { headers, params }).pipe(
      tap(response => console.log('API Response:', response)),
      map(response => {
        return response.map(clase => {
          const seccion = clase.seccion_id;
          return {
            id: clase.id,
            fecha: clase.fecha,
            hora_inicio: clase.hora_inicio,
            hora_termino: clase.hora_termino,
            seccion_id: seccion.id,
            nombre_seccion: seccion.nombre_seccion,
            profesor_id: seccion.profesor_id,
            asignatura_id: seccion.asignatura_id
          };
        });
      })
    );
  }


}

