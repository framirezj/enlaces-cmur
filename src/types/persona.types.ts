export interface Persona {
  rut: string;
  nombre: string;
  sexo: 'M' | 'F';
  fechaNacimiento: string; // formato YYYY-MM-DD
  villa?: string;
  migrante: boolean;
  puebloOriginario: boolean;
}
