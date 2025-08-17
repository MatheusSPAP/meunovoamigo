import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = 'http://localhost:3000/api/eventos';

  constructor(private http: HttpClient) { }

  getEventos(ordenar: string = 'asc'): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}?ordenar=${ordenar}`);
  }

  createEvento(eventoData: Evento): Observable<any> {
    return this.http.post(this.apiUrl, eventoData);
  }

  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  getEventosByTipo(tipo: string, ordenar: string = 'asc'): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/tipo/${tipo}?ordenar=${ordenar}`);
  }

  getEventosByPeriodo(dataInicio: string, dataFim: string, ordenar: string = 'asc'): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}&ordenar=${ordenar}`);
  }
}
