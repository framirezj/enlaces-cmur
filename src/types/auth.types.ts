export type UserRole = "admin" | "usuario";

export interface Usuario {
  id: number;
  rut: string;
  nombre: string;
  rol: UserRole;
  email?: string | null;
  foto_url?: string | null;
  created_at?: string;
}

export interface LoginCredentials {
  rut: string;
  pin: string;
}

export interface RegisterPayload {
  rut: string;
  nombre: string;
  pin: string;
  email?: string;
  rol?: UserRole;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}
