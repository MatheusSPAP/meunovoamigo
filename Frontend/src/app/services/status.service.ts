import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Status } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private apiUrl = 'http://localhost:3000/api/status';

  constructor(private http: HttpClient) { }

  getStatus(): Observable<Status[]> {
    return this.http.get<any>(this.apiUrl).pipe(map(response => response.data));
  }
}
