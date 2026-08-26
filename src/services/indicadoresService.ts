import type { IndicadoresResumen } from "@/types/indicadores.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const indicadoresService = {
  /**
   * Obtiene el resumen diario de indicadores (clima, calidad del aire, UV, UTM) desde el backend.
   */
  async getResumenDiario(lat = -33.4569, lon = -70.6483): Promise<IndicadoresResumen> {
    const response = await fetch(
      `${API_URL}/indicadores/resumen-diario?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener indicadores del servidor");
    }

    return response.json();
  },
};
