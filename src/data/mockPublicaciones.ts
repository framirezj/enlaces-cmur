export type CategoriaPublicacion = "noticia" | "evento" | "comunicado";

export interface Publicacion {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: CategoriaPublicacion;
  autor: string;
  fecha: string; // ISO date string
  imagen?: string; // emoji placeholder
  destacada?: boolean;
}

export const MOCK_PUBLICACIONES: Publicacion[] = [
  {
    id: 1,
    titulo: "Jornada de Vacunación contra la Influenza 2026",
    resumen:
      "Se realizará una jornada masiva de vacunación para grupos prioritarios. Adultos mayores, embarazadas y niños entre 6 meses y 5 años tienen prioridad.",
    contenido: "",
    categoria: "evento",
    autor: "Dirección CESFAM",
    fecha: "2026-09-15",
    imagen: "💉",
    destacada: true,
  },
  {
    id: 2,
    titulo: "Nuevo Horario de Atención Período Septiembre",
    resumen:
      "Informamos a todos los funcionarios que a partir del 10 de septiembre el horario de atención de admisión se extiende hasta las 17:30 hrs.",
    contenido: "",
    categoria: "comunicado",
    autor: "Jefatura de Administración",
    fecha: "2026-09-08",
    imagen: "🕐",
    destacada: false,
  },
  {
    id: 3,
    titulo: "CESFAM Marta Ugarte recibe certificación MINSAL",
    resumen:
      "Nuestro CESFAM recibió la certificación de calidad del Ministerio de Salud por sus estándares de atención primaria. Un logro de todo el equipo.",
    contenido: "",
    categoria: "noticia",
    autor: "Equipo de Comunicaciones",
    fecha: "2026-09-05",
    imagen: "🏆",
    destacada: true,
  },
  {
    id: 4,
    titulo: "Taller de Salud Mental para Funcionarios",
    resumen:
      'El equipo de salud mental invita a todos los funcionarios a participar del taller "Herramientas para el Autocuidado" el próximo viernes 19 de septiembre.',
    contenido: "",
    categoria: "evento",
    autor: "Programa de Salud Mental",
    fecha: "2026-09-03",
    imagen: "🧠",
    destacada: false,
  },
  {
    id: 5,
    titulo: "Actualización del Sistema de Fichas Clínicas",
    resumen:
      "Se informa que el sistema RAYEN estará en mantención el día sábado 13 de septiembre entre las 08:00 y las 12:00 horas.",
    contenido: "",
    categoria: "comunicado",
    autor: "Unidad de Informática",
    fecha: "2026-09-01",
    imagen: "🖥️",
    destacada: false,
  },
  {
    id: 6,
    titulo: "Resultados del Programa PSCV Primer Semestre 2026",
    resumen:
      "Se publicaron los resultados del programa de salud cardiovascular del primer semestre. La cobertura alcanzó el 87% de la meta anual.",
    contenido: "",
    categoria: "noticia",
    autor: "Programa PSCV",
    fecha: "2026-08-28",
    imagen: "❤️",
    destacada: false,
  },
];
