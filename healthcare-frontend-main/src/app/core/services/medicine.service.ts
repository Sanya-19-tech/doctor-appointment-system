import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine, CreateMedicineRequest } from '../models/index';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private http    = inject(HttpClient);
  private baseUrl = 'https://localhost:7054/api/Medicine';

  getAll(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.baseUrl);
  }

  getById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateMedicineRequest): Observable<Medicine> {
    return this.http.post<Medicine>(this.baseUrl, data);
  }

  update(id: number, data: CreateMedicineRequest): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}