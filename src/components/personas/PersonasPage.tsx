import { useEffect, useState } from "react";
import type { Persona } from "@/types/persona.types";
import { personaService } from "@/services/personaService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MapPin, Globe, Sparkles, Calendar } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";

export function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    personaService
      .getPersonas()
      .then((data) => {
        if (active) {
          setPersonas(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error al cargar personas", error);
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Métricas rápidas para mejorar la estética y utilidad de la UI
  const total = personas.length;
  const migrantes = personas.filter((p) => p.migrante).length;
  const pueblosOriginarios = personas.filter((p) => p.puebloOriginario).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Registro de Personas
        </h1>
        <p className="text-muted-foreground text-sm">
          Gestión y visualización de pacientes/personas registradas en el
          programa.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Personas"
          value={total}
          loading={loading}
          icon={<Users className="size-6" />}
          iconClassName="bg-primary/10 text-primary"
        />
        <MetricCard
          title="Migrantes"
          value={migrantes}
          loading={loading}
          icon={<Globe className="size-6" />}
          iconClassName="bg-blue-500/10 text-blue-500"
        />
        <MetricCard
          title="Pueblos Originarios"
          value={pueblosOriginarios}
          loading={loading}
          icon={<Sparkles className="size-6" />}
          iconClassName="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Tabla de Personas */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Listado General
          </h2>
          <p className="text-xs text-muted-foreground">
            Datos básicos del registro local.
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[120px]">RUT</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-center w-[80px]">Sexo</TableHead>
                <TableHead className="w-[140px]">Fecha Nac.</TableHead>
                <TableHead>Villa / Población</TableHead>
                <TableHead className="text-right">Atributos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeletons de Carga
                Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-5 w-8 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : personas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground text-sm"
                  >
                    No se encontraron personas registradas.
                  </TableCell>
                </TableRow>
              ) : (
                personas.map((persona) => (
                  <TableRow
                    key={persona.rut}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono font-medium text-xs text-foreground/80">
                      {persona.rut}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground text-sm capitalize">
                      {persona.nombre.toLowerCase()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={persona.sexo === "M" ? "default" : "secondary"}
                        className={`text-xs font-bold ${persona.sexo === "M" ? "bg-blue-600 hover:bg-blue-600 text-white" : "bg-pink-600 hover:bg-pink-600 text-white"}`}
                      >
                        {persona.sexo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {persona.fechaNacimiento}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground/90 text-sm">
                      {persona.villa ? (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-muted-foreground" />
                          <span>{persona.villa}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">
                          Sin registrar
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {persona.migrante && (
                          <Badge
                            variant="outline"
                            className="border-blue-500/30 bg-blue-500/5 text-blue-500 text-[10px] uppercase font-bold tracking-wider px-2"
                          >
                            Migrante
                          </Badge>
                        )}
                        {persona.puebloOriginario && (
                          <Badge
                            variant="outline"
                            className="border-amber-500/30 bg-amber-500/5 text-amber-500 text-[10px] uppercase font-bold tracking-wider px-2"
                          >
                            P. Originario
                          </Badge>
                        )}
                        {!persona.migrante && !persona.puebloOriginario && (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
