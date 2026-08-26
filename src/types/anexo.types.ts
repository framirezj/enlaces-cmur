export interface Anexo {
  id: number | string;
  anexo: string;
  ubicacion: string;
  unidad_servicio?: string;
  unidadServicio: string;
  funcionarios: string;
  creado_por_id?: number | null;
  actualizado_por_id?: number | null;
}

export interface AnexoInput {
  anexo: string;
  ubicacion: string;
  unidadServicio: string;
  funcionarios: string;
}
