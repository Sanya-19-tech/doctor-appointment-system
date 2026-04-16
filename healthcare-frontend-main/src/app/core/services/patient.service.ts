import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, CreatePatientRequest } from '../models/index';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http    = inject(HttpClient);
  private baseUrl = 'https://localhost:7054/api/Patient';

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.baseUrl);
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${id}`);
  }

  create(data: CreatePatientRequest): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, data);
  }

  update(id: number, data: CreatePatientRequest): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}