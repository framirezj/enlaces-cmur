export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  foto_url: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}
