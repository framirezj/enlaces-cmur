export interface TemperaturaInfo {
  minima: number;
  maxima: number;
  unidad: string;
}

export interface RadiacionUVInfo {
  maximo_esperado: number;
  categoria: string;
}

export interface CalidadAireInfo {
  pm2_5_max: number;
  condicion: string;
  unidad: string;
}

export interface UTMInfo {
  valor: number;
  unidad: string;
}

export interface IndicadoresResumen {
  fecha: string;
  indicadores: {
    temperatura: TemperaturaInfo;
    radiacion_uv: RadiacionUVInfo;
    calidad_aire: CalidadAireInfo;
    utm: UTMInfo;
  };
}
