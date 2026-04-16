import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  DecodedToken
} from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7054/api';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {}

  // ─── LOGIN ───────────────────────────────────────────
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/Auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
        })
      );
  }

  // ─── REGISTER ────────────────────────────────────────
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/Auth/register`, data);
  }

  // ─── LOGOUT ──────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  // ─── GET TOKEN ───────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ─── IS LOGGED IN ────────────────────────────────────
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now; // token not expired
    } catch {
      return false;
    }
  }

  // ─── GET DECODED TOKEN ───────────────────────────────
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  // ─── GET ROLE ────────────────────────────────────────
  getRole(): string | null {
    const decoded = this.getDecodedToken();
    // .NET JWT stores role in this claim key
    if (!decoded) return null;
    const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    return (decoded as any)[roleKey] ?? (decoded as any)['role'] ?? null;
  }

  // ─── IS ADMIN ────────────────────────────────────────
  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  // ─── GET USER NAME ───────────────────────────────────
  getUserName(): string {
    const decoded = this.getDecodedToken();
    return (decoded as any)?.['name'] ??
           (decoded as any)?.['unique_name'] ?? 'User';
  }
}