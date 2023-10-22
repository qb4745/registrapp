import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MongobdService {
  private apiUrl = 'https://sa-east-1.aws.data.mongodb-api.com/app/data-xcgmd/endpoint/data/v1/action/findOne';

  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': 'nPstizYANrcnE5UlKFTZfd2VklbwP7RvPrndowN2qkWJJblPsH4apslCPXhnyQIS'
    });

    const params = new HttpParams()
      .set('collection', 'registrapp')
      .set('database', 'test')
      .set('dataSource', 'Cluster0');

    return this.http.post<any>(this.apiUrl, null, { headers, params });
  }
}