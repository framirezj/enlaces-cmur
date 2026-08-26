import { useEffect, useState } from "react";
import { Thermometer, Sun, Wind, TrendingUp } from "lucide-react";
import type { IndicadoresResumen } from "@/types/indicadores.types";
import { indicadoresService } from "@/services/indicadoresService";

export function TopInfoBar() {
  const [data, setData] = useState<IndicadoresResumen | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIndicadores = async () => {
      try {
        const result = await indicadoresService.getResumenDiario();
        setData(result);
      } catch (err) {
        console.error("Error al cargar indicadores desde el backend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicadores();

    // Actualizar cada 15 minutos
    const interval = setInterval(fetchIndicadores, 900000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-7 w-20 bg-sidebar-accent animate-pulse rounded-full" />
        <div className="h-7 w-24 bg-sidebar-accent animate-pulse rounded-full hidden sm:block" />
        <div className="h-7 w-20 bg-sidebar-accent animate-pulse rounded-full" />
      </div>
    );
  }

  if (!data) return null;

  const { temperatura, radiacion_uv, calidad_aire, utm } = data.indicadores;

  // Formatear valor de UTM como pesos chilenos ($71.649)
  const utmFormateada = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(utm.valor);

  // Color de indicador de calidad del aire
  const getAireBadgeColor = (condicion: string) => {
    const c = condicion.toLowerCase();
    if (c.includes("buena")) return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    if (c.includes("regular")) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-destructive border-destructive/30 bg-destructive/10";
  };

  return (
    <div className="flex items-center gap-2 md:gap-3 text-xs">
      {/* Temperatura */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sidebar-accent border border-sidebar-border text-muted-foreground hover:text-foreground transition-colors shadow-xs">
        <Thermometer className="size-3.5 text-blue-500 shrink-0" />
        <span className="font-semibold text-foreground">
          {temperatura.maxima}{temperatura.unidad}
        </span>
        <span className="text-[10px] text-muted-foreground hidden md:inline">
          (mín {temperatura.minima}{temperatura.unidad})
        </span>
      </div>

      {/* Calidad del Aire */}
      <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs ${getAireBadgeColor(calidad_aire.condicion)}`}>
        <Wind className="size-3.5 shrink-0" />
        <span className="font-medium">
          Aire: {calidad_aire.condicion}
        </span>
      </div>

      {/* Radiación UV */}
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-sidebar-accent border border-sidebar-border text-muted-foreground hover:text-foreground transition-colors shadow-xs">
        <Sun className="size-3.5 text-amber-500 shrink-0" />
        <span>UV:</span>
        <span className="font-semibold text-foreground">
          {radiacion_uv.categoria} ({radiacion_uv.maximo_esperado})
        </span>
      </div>

      {/* Valor de la UTM */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sidebar-accent border border-sidebar-border text-muted-foreground hover:text-foreground transition-colors shadow-xs">
        <TrendingUp className="size-3.5 text-emerald-500 shrink-0" />
        <span className="text-muted-foreground">UTM:</span>
        <span className="font-bold text-foreground">
          {utmFormateada}
        </span>
      </div>
    </div>
  );
}
