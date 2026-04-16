export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  name?: string;
  exp: number;
  iat: number;
}