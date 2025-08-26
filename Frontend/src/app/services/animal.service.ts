import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from '../models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = 'http://localhost:3000/api/animais';

  constructor(private http: HttpClient) { }

  getAnimais(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl);
  }

  getAnimalById(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/${id}`);
  }

  createAnimal(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateAnimalStatus(id: number, statusId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/status/${id}`, { fk_idstatus: statusId });
  }

  getAnimalsByOwnerId(ownerId: number): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/usuario/${ownerId}`);
  }
}
