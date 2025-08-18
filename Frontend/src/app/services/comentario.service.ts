import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl = 'http://localhost:3000/api/comentarios';

  constructor(private http: HttpClient) { }

  getComentariosByPostId(postId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}/postagem/${postId}`);
  }

  createComentario(comentarioData: Comentario): Observable<any> {
    return this.http.post(this.apiUrl, comentarioData);
  }
}
