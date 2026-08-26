import type { Anexo, AnexoInput } from "@/types/anexo.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Normaliza la respuesta del backend basada en la entidad Anexo:
 * (id, anexo, ubicacion, unidad_servicio, funcionarios, creado_por_id, actualizado_por_id)
 */
function normalizeAnexo(item: any): Anexo {
  const unidadVal = item.unidad_servicio ?? item.unidadServicio ?? "";
  return {
    id: item.id ?? item._id ?? Math.random(),
    anexo: item.anexo ?? "",
    ubicacion: item.ubicacion ?? "",
    unidad_servicio: unidadVal,
    unidadServicio: unidadVal,
    funcionarios: item.funcionarios ?? "",
    creado_por_id: item.creado_por_id ?? null,
    actualizado_por_id: item.actualizado_por_id ?? null,
  };
}

/**
 * Mapea los datos del formulario al esquema Pydantic/SQLAlchemy del backend:
 * { anexo, ubicacion, unidad_servicio, funcionarios }
 */
function toBackendPayload(input: AnexoInput) {
  return {
    anexo: input.anexo,
    ubicacion: input.ubicacion,
    unidad_servicio: input.unidadServicio,
    funcionarios: input.funcionarios,
  };
}

/**
 * Genera los headers con el token JWT para autorización y auditoría
 */
function getHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const anexoService = {
  /**
   * Obtiene la lista completa de anexos telefónicos (GET /anexos/)
   */
  async getAnexos(): Promise<Anexo[]> {
    const response = await fetch(`${API_URL}/anexos/`);
    if (!response.ok) {
      throw new Error(`Error al obtener anexos (${response.status})`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map(normalizeAnexo);
  },

  /**
   * Crea un nuevo anexo telefónico (POST /anexos/)
   * El backend asociará creado_por_id automáticamente utilizando el token Bearer.
   */
  async createAnexo(input: AnexoInput, token?: string | null): Promise<Anexo> {
    const payload = toBackendPayload(input);
    const response = await fetch(`${API_URL}/anexos/`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.detail || `Error al crear anexo (${response.status})`;
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeAnexo(data);
  },

  /**
   * Actualiza un anexo existente (PUT /anexos/{anexo_id})
   * El backend asociará actualizado_por_id automáticamente utilizando el token Bearer.
   */
  async updateAnexo(
    id: number | string,
    input: AnexoInput,
    token?: string | null
  ): Promise<Anexo> {
    const payload = toBackendPayload(input);
    const response = await fetch(`${API_URL}/anexos/${id}`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.detail || `Error al actualizar anexo (${response.status})`;
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeAnexo(data);
  },

  /**
   * Elimina un anexo por su ID (DELETE /anexos/{anexo_id})
   */
  async deleteAnexo(id: number | string, token?: string | null): Promise<void> {
    const response = await fetch(`${API_URL}/anexos/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.detail || `Error al eliminar anexo (${response.status})`;
      throw new Error(message);
    }
  },
};
