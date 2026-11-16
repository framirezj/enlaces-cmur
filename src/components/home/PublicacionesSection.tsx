import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Newspaper,
  CalendarDays,
  Megaphone,
  ChevronRight,
  Star,
  User,
  Clock,
} from "lucide-react";
import {
  MOCK_PUBLICACIONES,
  type Publicacion,
  type CategoriaPublicacion,
} from "@/data/mockPublicaciones";

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */
const CATEGORIA_CONFIG: Record<
  CategoriaPublicacion,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    badgeClass: string;
  }
> = {
  noticia: {
    label: "Noticia",
    icon: Newspaper,
    color: "text-blue-600 dark:text-blue-400",
    badgeClass:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  },
  evento: {
    label: "Evento",
    icon: CalendarDays,
    color: "text-emerald-600 dark:text-emerald-400",
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  },
  comunicado: {
    label: "Comunicado",
    icon: Megaphone,
    color: "text-amber-600 dark:text-amber-400",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  },
};

const FILTROS: { value: CategoriaPublicacion | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "noticia", label: "Noticias" },
  { value: "evento", label: "Eventos" },
  { value: "comunicado", label: "Comunicados" },
];

function formatFecha(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ──────────────────────────────────────────────
   Tarjeta individual
────────────────────────────────────────────── */
function PublicacionCard({
  pub,
  onClick,
}: {
  pub: Publicacion;
  onClick: () => void;
}) {
  const cfg = CATEGORIA_CONFIG[pub.categoria];
  const Icon = cfg.icon;

  return (
    <Card
      className={`group relative flex flex-col cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/40 overflow-hidden ${
        pub.destacada ? "ring-1 ring-primary/30" : ""
      }`}
      onClick={onClick}
    >
      {/* Banda superior de color */}
      <div
        className={`h-1 w-full ${
          pub.categoria === "noticia"
            ? "bg-blue-500"
            : pub.categoria === "evento"
              ? "bg-emerald-500"
              : "bg-amber-500"
        }`}
      />

      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-[11px] ${cfg.badgeClass}`}>
              <Icon className="size-3 mr-1" />
              {cfg.label}
            </Badge>
            {pub.destacada && (
              <Badge
                variant="outline"
                className="text-[11px] bg-primary/10 text-primary border-primary/20"
              >
                <Star className="size-3 mr-1 fill-primary" />
                Destacado
              </Badge>
            )}
          </div>
          <span className="text-4xl leading-none shrink-0">{pub.imagen}</span>
        </div>
        <CardTitle className="text-base font-semibold leading-snug mt-2 group-hover:text-primary transition-colors line-clamp-2">
          {pub.titulo}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-3 pt-0">
        <CardDescription className="text-sm line-clamp-3 flex-1">
          {pub.resumen}
        </CardDescription>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
          <span className="flex items-center gap-1.5">
            <User className="size-3" />
            {pub.autor}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3" />
            {formatFecha(pub.fecha)}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-between text-xs h-8 ${cfg.color} hover:bg-current/10`}
        >
          Leer más <ChevronRight className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

/* ──────────────────────────────────────────────
   Modal de detalle
────────────────────────────────────────────── */
function PublicacionModal({
  pub,
  open,
  onClose,
}: {
  pub: Publicacion | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!pub) return null;
  const cfg = CATEGORIA_CONFIG[pub.categoria];
  const Icon = cfg.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={`text-xs ${cfg.badgeClass}`}>
              <Icon className="size-3 mr-1" />
              {cfg.label}
            </Badge>
            {pub.destacada && (
              <Badge
                variant="outline"
                className="text-xs bg-primary/10 text-primary border-primary/20"
              >
                <Star className="size-3 mr-1 fill-primary" />
                Destacado
              </Badge>
            )}
          </div>
          <div className="text-4xl mb-2">{pub.imagen}</div>
          <DialogTitle className="text-xl leading-snug">{pub.titulo}</DialogTitle>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <User className="size-3" /> {pub.autor}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" /> {formatFecha(pub.fecha)}
            </span>
          </div>
        </DialogHeader>
        <DialogDescription className="text-sm text-foreground/80 leading-relaxed pt-2">
          {pub.resumen}
          {/* Placeholder de contenido completo */}
          <p className="mt-4 text-muted-foreground italic text-xs">
            [El contenido completo de esta publicación estará disponible cuando
            se implemente el editor de publicaciones.]
          </p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────────────────────────────────────
   Sección principal (exportada)
────────────────────────────────────────────── */
export function PublicacionesSection() {
  const [filtro, setFiltro] = useState<CategoriaPublicacion | "todos">("todos");
  const [seleccionada, setSeleccionada] = useState<Publicacion | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const publicacionesFiltradas =
    filtro === "todos"
      ? MOCK_PUBLICACIONES
      : MOCK_PUBLICACIONES.filter((p) => p.categoria === filtro);

  const handleOpen = (pub: Publicacion) => {
    setSeleccionada(pub);
    setModalAbierto(true);
  };

  return (
    <section className="flex flex-col gap-4">
      {/* Cabecera de sección */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Newspaper className="size-5 text-primary" />
            Publicaciones
          </h2>
          <p className="text-sm text-muted-foreground">
            Noticias, eventos y comunicados del CESFAM
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {FILTROS.map((f) => (
          <Button
            key={f.value}
            variant={filtro === f.value ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setFiltro(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {publicacionesFiltradas.map((pub) => (
          <PublicacionCard
            key={pub.id}
            pub={pub}
            onClick={() => handleOpen(pub)}
          />
        ))}
        {publicacionesFiltradas.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground text-sm">
            No hay publicaciones en esta categoría.
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      <PublicacionModal
        pub={seleccionada}
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </section>
  );
}
