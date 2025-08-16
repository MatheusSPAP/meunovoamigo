import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InteresseAdocao } from '../models/interesse-adocao.model';

@Injectable({
  providedIn: 'root'
})
export class InteresseAdocaoService {
  private apiUrl = 'http://localhost:3000/api/interesses-adocao';

  constructor(private http: HttpClient) { }

  getInteressesAdocao(): Observable<InteresseAdocao[]> {
    return this.http.get<InteresseAdocao[]>(this.apiUrl);
  }

  createInteresseAdocao(data: { mensagem: string, usuario_idusuario: number, animal_idAnimal: number, animal_fk_idusuario: number, animal_fk_idstatus: number }): Observable<any> {
    const payload = {
      ...data,
      interesse_status: 'Aguardando',
      data_interesse: new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    };
    return this.http.post(this.apiUrl, payload);
  }

  getInteressesByUsuario(userId: number): Observable<InteresseAdocao[]> {
    return this.http.get<InteresseAdocao[]>(`${this.apiUrl}/usuario/${userId}`);
  }

  getInteressesByDonoAnimal(ownerId: number): Observable<InteresseAdocao[]> {
    return this.http.get<InteresseAdocao[]>(`${this.apiUrl}/dono/${ownerId}`); // Corrected URL
  }

  updateInteresseStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/status/${id}`, { status });
  }
}
