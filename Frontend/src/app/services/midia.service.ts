import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Midia } from '../models/midia.model';

@Injectable({
  providedIn: 'root'
})
export class MidiaService {
  private apiUrl = 'http://localhost:3000/api/midias';

  constructor(private http: HttpClient) { }

  // Busca todas as mídias associadas a um ID de postagem específico
  getMidiasByPostId(postId: number): Observable<{ success: boolean, data: Midia[] }> {
    return this.http.get<{ success: boolean, data: Midia[] }>(`${this.apiUrl}/postagem/${postId}`);
  }

  // Deleta uma mídia pelo seu ID
  deleteMidia(midiaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${midiaId}`);
  }
}
