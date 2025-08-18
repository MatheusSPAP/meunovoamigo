import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comportamento } from '../models/comportamento.model';

@Injectable({
  providedIn: 'root'
})
export class ComportamentoService {
  private apiUrl = 'http://localhost:3000/api/comportamentos';

  constructor(private http: HttpClient) { }

  getComportamentos(): Observable<Comportamento[]> {
    return this.http.get<Comportamento[]>(this.apiUrl);
  }
}
