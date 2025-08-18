import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TamanhoAnimal } from '../models/tamanho-animal.model';

@Injectable({
  providedIn: 'root'
})
export class TamanhoAnimalService {
  private apiUrl = 'http://localhost:3000/api/tamanhos';

  constructor(private http: HttpClient) { }

  getTamanhos(): Observable<TamanhoAnimal[]> {
    return this.http.get<TamanhoAnimal[]>(this.apiUrl);
  }
}
