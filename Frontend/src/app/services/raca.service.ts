import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Raca } from '../models/raca.model';

@Injectable({
  providedIn: 'root'
})
export class RacaService {
  private apiUrl = 'http://localhost:3000/api/racas';

  constructor(private http: HttpClient) { }

  getRacas(): Observable<Raca[]> {
    return this.http.get<Raca[]>(this.apiUrl);
  }

  getRacasByTipo(tipoId: number): Observable<Raca[]> {
    return this.http.get<Raca[]>(`${this.apiUrl}/tipo/${tipoId}`);
  }
}
