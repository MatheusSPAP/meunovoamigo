import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tipo } from '../models/tipo.model';

@Injectable({
  providedIn: 'root'
})
export class TipoService {
  private apiUrl = 'http://localhost:3000/api/tipos';

  constructor(private http: HttpClient) { }

  getTipos(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(this.apiUrl);
  }
}
