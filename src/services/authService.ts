import type {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  Usuario,
} from "@/types/auth.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const authService = {
  /**
   * Inicia sesión con RUT y PIN de 4 dígitos.
   * Retorna el JWT (access_token) y los datos del usuario.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rut: credentials.rut.trim(),
        pin: credentials.pin.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error(errorData.detail || "RUT o PIN incorrecto");
      }
      if (response.status === 422) {
        throw new Error("El PIN debe tener exactamente 4 dígitos numéricos.");
      }
      throw new Error(
        typeof errorData.detail === "string"
          ? errorData.detail
          : "Error al iniciar sesión en el servidor"
      );
    }

    return response.json();
  },

  /**
   * Registra un nuevo funcionario en el sistema (endpoint público).
   */
  async register(payload: RegisterPayload): Promise<Usuario> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rut: payload.rut.trim(),
        nombre: payload.nombre.trim(),
        pin: payload.pin.trim(),
        email: payload.email?.trim() || null,
        rol: payload.rol || "usuario",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 409) {
        throw new Error(errorData.detail || "El RUT o correo ya se encuentra registrado");
      }
      if (response.status === 422) {
        throw new Error("Datos inválidos. Verifique que el PIN tenga 4 dígitos.");
      }
      throw new Error(
        typeof errorData.detail === "string"
          ? errorData.detail
          : "Error al registrar usuario en el servidor"
      );
    }

    return response.json();
  },

  /**
   * Obtiene la información del usuario autenticado actualmente usando el token Bearer.
   */
  async getCurrentUser(token: string): Promise<Usuario> {
    const response = await fetch(`${API_URL}/usuarios/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Sesión expirada o token inválido");
    }

    return response.json();
  },
};
