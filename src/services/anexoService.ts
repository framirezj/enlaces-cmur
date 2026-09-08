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
    creado_por_id: item.creado_por_id ?? item.creadoPorId ?? null,
    actualizado_por_id: item.actualizado_por_id ?? item.actualizadoPorId ?? null,
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
   * Obtiene la lista de anexos telefónicos paginada y filtrada (GET /anexos/)
   */
  async getAnexos(params?: {
    page?: number;
    size?: number;
    search?: string;
    unidadServicio?: string;
  }): Promise<{
    items: Anexo[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }> {
    const queryParams = new URLSearchParams();
    queryParams.append("page", (params?.page ?? 1).toString());
    queryParams.append("size", (params?.size ?? 20).toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.unidadServicio && params.unidadServicio !== "TODOS") {
      queryParams.append("unidadServicio", params.unidadServicio);
    }

    const response = await fetch(`${API_URL}/anexos/?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Error al obtener anexos (${response.status})`);
    }
    const data = await response.json();
    
    if (data && typeof data === "object" && "items" in data && Array.isArray(data.items)) {
      return {
        items: data.items.map(normalizeAnexo),
        total: data.total ?? 0,
        page: data.page ?? 1,
        size: data.size ?? 20,
        pages: data.pages ?? 1,
      };
    }
    
    const items = Array.isArray(data) ? data : [];
    return {
      items: items.map(normalizeAnexo),
      total: items.length,
      page: 1,
      size: items.length || 20,
      pages: 1,
    };
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
