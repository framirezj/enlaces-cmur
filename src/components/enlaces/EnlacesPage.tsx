import { useEffect, useState } from "react";
import type { Enlace, Favorito } from "@/types/enlace.types";
import { enlaceService } from "@/services/enlaceService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Link2,
  ExternalLink,
  Globe,
  Search,
  RefreshCw,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  Filter,
  Star,
} from "lucide-react";

import { MetricCard } from "@/components/ui/metric-card";
import { useAuth } from "@/hooks/useAuth";

export function EnlacesPage() {
  const { user, token } = useAuth();
  const [enlaces, setEnlaces] = useState<Enlace[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("TODOS");
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const fetchEnlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enlaceService.getEnlaces();
      setEnlaces(data);
      if (token) {
        const favs = await enlaceService.getFavoritos(token);
        setFavoritos(favs);
      }
    } catch (err) {
      console.error("Error al cargar los enlaces o favoritos:", err);
      setError(
        "No se pudieron cargar los enlaces. Por favor, verifica la conexión con el servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cargar enlaces al montar
  useEffect(() => {
    fetchEnlaces();
  }, [token]);

  // Cargar favoritos si el token cambia
  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!token) {
        setFavoritos([]);
        return;
      }
      try {
        const data = await enlaceService.getFavoritos(token);
        setFavoritos(data);
      } catch (err) {
        console.error("Error al cargar favoritos:", err);
      }
    };

    fetchFavoritos();
  }, [token]);

  const handleImageError = (id: number) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Comprobar si un enlace está en favoritos
  const esFavorito = (enlaceId: number) => {
    return favoritos.some((f) => f.enlace.id === enlaceId);
  };

  // Alternar favorito con UI Optimista
  const handleToggleFavorito = async (enlaceId: number) => {
    if (!token) return;

    const yaEsFavorito = esFavorito(enlaceId);
    const originalFavoritos = [...favoritos];

    // Actualización optimista de la UI
    if (yaEsFavorito) {
      setFavoritos((prev) => prev.filter((f) => f.enlace.id !== enlaceId));
    } else {
      const enlace = enlaces.find((e) => e.id === enlaceId);
      if (enlace) {
        setFavoritos((prev) => [
          ...prev,
          { enlace, created_at: new Date().toISOString() },
        ]);
      }
    }

    try {
      if (yaEsFavorito) {
        await enlaceService.removeFavorito(enlaceId, token);
      } else {
        await enlaceService.addFavorito(enlaceId, token);
      }
      // Sincronizar estado real con el backend
      const updated = await enlaceService.getFavoritos(token);
      setFavoritos(updated);
    } catch (err) {
      console.error("Error al guardar/eliminar favorito:", err);
      // Revertir en caso de error
      setFavoritos(originalFavoritos);
    }
  };

  // Filtrado dinámico por texto y categoría
  const enlacesFiltrados = enlaces.filter((enlace) => {
    const coincideBusqueda =
      enlace.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      enlace.url.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === "TODOS" ||
      enlace.categoria === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  // Métricas rápidas
  const totalEnlaces = enlaces.length;
  const totalSidra = enlaces.filter((e) => e.categoria === "SIDRA").length;
  const totalOtros = enlaces.filter((e) => e.categoria === "OTROS").length;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Link2 className="size-7 text-primary" />
            Directorio de Enlaces y Sistemas
          </h1>
          <p className="text-muted-foreground text-sm">
            Accesos directos a las plataformas clínicas, sistemas
            administrativos y portales de utilidad para el CESFAM.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchEnlaces}
          disabled={loading}
          className="w-fit flex items-center gap-2 shadow-xs"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {/* Tarjetas de Métricas Rápidas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Total Enlaces"
          value={totalEnlaces}
          loading={loading}
          icon={<LayoutGrid className="size-6" />}
          iconClassName="bg-primary/10 text-primary"
        />
        <MetricCard
          title="Sistemas SIDRA"
          value={totalSidra}
          loading={loading}
          icon={<Sparkles className="size-6" />}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <MetricCard
          title="Otros Portales"
          value={totalOtros}
          loading={loading}
          icon={<Globe className="size-6" />}
          iconClassName="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Sección Compacta de Enlaces Favoritos (Solo si está logueado y tiene favoritos) */}
      {user && favoritos.length > 0 && (
        <div className="space-y-3 bg-gradient-to-r from-primary/[0.04] via-primary/[0.01] to-transparent p-5 rounded-2xl border border-primary/10 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Star className="size-5 fill-yellow-400 text-yellow-400 animate-pulse" />
              Mis Enlaces Favoritos
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full font-medium">
              {favoritos.length} {favoritos.length === 1 ? "enlace" : "enlaces"}
            </span>
          </div>
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favoritos.map(({ enlace }) => {
              return (
                <Card
                  key={`fav-${enlace.id}`}
                  className="group relative overflow-hidden flex flex-col justify-between border-primary/15 hover:border-primary/45 transition-all duration-300 hover:shadow-md bg-card p-3"
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                        {enlace.categoria === "SIDRA" ? (
                          <Sparkles className="size-4" />
                        ) : (
                          <Globe className="size-4" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors leading-tight">
                          {enlace.titulo}
                        </h3>
                        <span className="text-[10px] text-muted-foreground font-mono truncate">
                          {enlace.url.replace(/^https?:\/\//, "")}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFavorito(enlace.id)}
                      className="p-1 rounded-md text-yellow-400 hover:bg-muted cursor-pointer shrink-0 transition-colors"
                      title="Quitar de favoritos"
                    >
                      <Star className="size-3.5 fill-yellow-400" />
                    </button>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full justify-between h-8 text-xs hover:bg-primary hover:text-primary-foreground group/btn transition-all border border-border/40 hover:border-transparent"
                  >
                    <a
                      href={enlace.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full"
                    >
                      <span>Ir al sitio</span>
                      <ExternalLink className="size-3 transition-transform group-hover/btn:translate-x-0.5" />
                    </a>
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border border-border shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar enlaces por nombre o URL..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="size-4 text-muted-foreground mr-1 hidden sm:block" />
          <span className="text-xs text-muted-foreground mr-2 font-medium hidden sm:inline">
            Categorías:
          </span>

          {(["TODOS", "SIDRA", "OTROS"] as const).map((cat) => (
            <Button
              key={cat}
              variant={categoriaSeleccionada === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoriaSeleccionada(cat)}
              className="text-xs h-8 px-3 rounded-lg"
            >
              {cat === "TODOS" ? "Todos" : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Manejo de Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center gap-3">
          <AlertCircle className="size-5 shrink-0" />
          <div className="flex-1 text-sm">{error}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEnlaces}
            className="border-destructive/30 hover:bg-destructive/20"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Grilla de Tarjetas (Cards) */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card
              key={idx}
              className="overflow-hidden flex flex-col justify-between"
            >
              <div>
                <Skeleton className="h-36 w-full rounded-t-xl rounded-b-none" />
                <CardHeader className="p-4 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </div>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-9 w-full rounded-lg" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : enlacesFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-card/50 space-y-3">
          <div className="p-4 bg-muted rounded-full">
            <Globe className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No se encontraron enlaces
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {busqueda || categoriaSeleccionada !== "TODOS"
              ? "Prueba ajustando los filtros de búsqueda o cambiando la categoría seleccionada."
              : "Aún no hay enlaces registrados en el sistema."}
          </p>
          {(busqueda || categoriaSeleccionada !== "TODOS") && (
            <Button
              variant="link"
              onClick={() => {
                setBusqueda("");
                setCategoriaSeleccionada("TODOS");
              }}
              className="text-primary text-sm"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {enlacesFiltrados.map((enlace) => {
            const hasValidImage =
              enlace.imagen_path && !failedImages[enlace.id];

            return (
              <Card
                key={enlace.id}
                className="group overflow-hidden flex flex-col justify-between border-border/80 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card relative"
              >
                <div>
                  {/* Banner / Imagen de Previsualización */}
                  <div className="relative h-56 w-full overflow-hidden bg-muted/60 flex items-center justify-center border-b border-border/50">
                    
                    {/* Botón de Estrella Favorito (Solo si está logueado) */}
                    {user && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFavorito(enlace.id);
                        }}
                        className="absolute top-3 left-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-all cursor-pointer border border-white/10 z-10 hover:scale-105"
                        title={
                          esFavorito(enlace.id)
                            ? "Quitar de favoritos"
                            : "Agregar a favoritos"
                        }
                      >
                        <Star
                          className={`size-4 transition-colors ${
                            esFavorito(enlace.id)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white"
                          }`}
                        />
                      </button>
                    )}

                    {hasValidImage ? (
                      <img
                        src={enlace.imagen_path}
                        alt={enlace.titulo}
                        onError={() => handleImageError(enlace.id)}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 via-muted to-primary/5 flex flex-col items-center justify-center gap-2 p-4 text-center">
                        {enlace.categoria === "SIDRA" ? (
                          <Sparkles className="size-10 text-primary/60 group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <Globe className="size-10 text-purple-500/60 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-full px-2">
                          {enlace.url.replace(/^https?:\/\//, "")}
                        </span>
                      </div>
                    )}

                    {/* Badge de Categoría flotante sobre la imagen */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={
                          enlace.categoria === "SIDRA" ? "default" : "secondary"
                        }
                        className={
                          enlace.categoria === "SIDRA"
                            ? "bg-blue-600 hover:bg-blue-600 text-white font-bold text-[10px] tracking-wide px-2.5 py-0.5 shadow-xs"
                            : "bg-purple-600 hover:bg-purple-600 text-white font-bold text-[10px] tracking-wide px-2.5 py-0.5 shadow-xs"
                        }
                      >
                        {enlace.categoria}
                      </Badge>
                    </div>
                  </div>

                  {/* Detalle del Enlace */}
                  <CardHeader className="p-4 space-y-1">
                    <h3 className="font-semibold text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {enlace.titulo}
                    </h3>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground font-mono truncate flex items-center gap-1.5">
                      <Globe className="size-3.5 shrink-0 text-muted-foreground/70" />
                      <span className="truncate">{enlace.url}</span>
                    </p>
                  </CardContent>
                </div>

                {/* Acción de Apertura */}
                <CardFooter className="p-4 pt-0">
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="w-full justify-between gap-2 shadow-xs group-hover:bg-primary transition-colors"
                  >
                    <a
                      href={enlace.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full"
                    >
                      <span>Ingresar al sitio</span>
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
