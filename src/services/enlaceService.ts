import type { Enlace, Favorito } from "@/types/enlace.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const enlaceService = {
  /**
   * Obtiene la lista completa de enlaces de manera asíncrona
   */
  async getEnlaces(): Promise<Enlace[]> {
    const response = await fetch(`${API_URL}/enlaces`);
    if (!response.ok) {
      throw new Error("Error al obtener los enlaces");
    }
    return response.json();
  },

  /**
   * Obtiene la lista completa de favoritos del usuario autenticado
   */
  async getFavoritos(token: string): Promise<Favorito[]> {
    const response = await fetch(`${API_URL}/usuarios/me/favoritos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los favoritos");
    }

    return response.json();
  },

  /**
   * Agrega un enlace a los favoritos del usuario
   */
  async addFavorito(enlaceId: number, token: string): Promise<Favorito> {
    const response = await fetch(`${API_URL}/usuarios/me/favoritos/${enlaceId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al agregar favorito");
    }

    return response.json();
  },

  /**
   * Elimina un enlace de los favoritos del usuario
   */
  async removeFavorito(enlaceId: number, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios/me/favoritos/${enlaceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar favorito");
    }
  },
};
