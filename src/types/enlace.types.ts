export interface Enlace {
  titulo: string;
  categoria: CategoriaEnlace;
  url: string;
  imagen_path: string;
  id: number;
}

export type CategoriaEnlace = "SIDRA" | "OTROS";

export interface Favorito {
  enlace: Enlace;
  created_at: string;
}
