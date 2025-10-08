import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Raca } from '../models/raca.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RacaService {
  private apiUrl = 'http://localhost:3000/api/racas';

  constructor(private http: HttpClient) { }

  getRacas(): Observable<Raca[]> {
    return this.http.get<any>(this.apiUrl).pipe(map(response => response.data));
  }

  getRacasByTipo(tipoId: number): Observable<Raca[]> {
    return this.http.get<any>(`${this.apiUrl}/tipo/${tipoId}`).pipe(map(response => response.data));
  }
}
