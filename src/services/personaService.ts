import type { Persona } from "@/types/persona.types";

// Datos simulados (3 personas)
const MOCK_PERSONAS: Persona[] = [
  {
    rut: "16791213-3",
    nombre: "Francisco Javier Ramírez Jorquera",
    sexo: "M",
    fechaNacimiento: "1988-05-14",
    villa: "Villa Las Casas",
    migrante: false,
    puebloOriginario: false,
  },
  {
    rut: "18942351-K",
    nombre: "María Constanza Valenzuela Soto",
    sexo: "F",
    fechaNacimiento: "1995-11-22",
    villa: "Villa Las Flores",
    migrante: false,
    puebloOriginario: true,
  },
  {
    rut: "25412896-7",
    nombre: "Jean Pierre Baptiste",
    sexo: "M",
    fechaNacimiento: "1992-08-03",
    villa: "Villa El Sol",
    migrante: true,
    puebloOriginario: false,
  },
];

export const personaService = {
  /**
   * Obtiene la lista completa de personas de manera asíncrona,
   * simulando un retardo de red de 800ms.
   */
  async getPersonas(): Promise<Persona[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_PERSONAS]);
      }, 800);
    });
  },
};
