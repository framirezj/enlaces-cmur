import type { AuthResponse, Usuario } from "@/types/auth.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const authService = {
  /**
   * Envía el id_token de Google al backend para iniciar sesión.
   * El backend valida el token con Google y retorna un token propio (JWT) junto con el usuario.
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_token: idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || "Error al iniciar sesión con Google en el servidor"
      );
    }

    return response.json();
  },

  /**
   * Obtiene la información del usuario autenticado actualmente usando el token del backend.
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
