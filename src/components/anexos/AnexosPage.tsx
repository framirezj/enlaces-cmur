import { useEffect, useState, useMemo, useCallback } from "react";
import type { Anexo, AnexoInput } from "@/types/anexo.types";
import { anexoService } from "@/services/anexoService";
import { useAuth } from "@/hooks/useAuth";
import { AnexoModal } from "./AnexoModal";
import { DeleteAnexoModal } from "./DeleteAnexoModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/components/ui/metric-card";
import { Input } from "@/components/ui/input";
import {
  PhoneCall,
  Phone,
  Building2,
  MapPin,
  Users,
  Search,
  Check,
  Copy,
  Layers,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  Lock,
} from "lucide-react";

export function AnexosPage() {
  const { user, token } = useAuth();
  const isAuthenticated = Boolean(user);

  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("TODOS");
  const [copiedAnexo, setCopiedAnexo] = useState<string | null>(null);

  // Estados de Modales
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [anexoToEdit, setAnexoToEdit] = useState<Anexo | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [anexoToDelete, setAnexoToDelete] = useState<Anexo | null>(null);

  // Notificación tipo Toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cargar lista de anexos desde el backend
  const fetchAnexos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await anexoService.getAnexos();
      setAnexos(data);
    } catch (err: any) {
      console.error("Error al cargar anexos:", err);
      setError(
        "No se pudo conectar con el servidor backend para obtener los anexos. Verifique que el servicio backend en localhost:8000 esté corriendo.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnexos();
  }, [fetchAnexos]);

  // Copiar anexo al portapapeles
  const handleCopyAnexo = (anexoNum: string) => {
    navigator.clipboard.writeText(anexoNum);
    setCopiedAnexo(anexoNum);
    setTimeout(() => {
      setCopiedAnexo(null);
    }, 2000);
  };

  // Abrir modal de creación (Solo si está autenticado)
  const handleOpenCreateModal = () => {
    if (!isAuthenticated) return;
    setAnexoToEdit(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal de edición (Solo si está autenticado)
  const handleOpenEditModal = (anexo: Anexo) => {
    if (!isAuthenticated) return;
    setAnexoToEdit(anexo);
    setIsFormModalOpen(true);
  };

  // Abrir modal de eliminación (Solo si está autenticado)
  const handleOpenDeleteModal = (anexo: Anexo) => {
    if (!isAuthenticated) return;
    setAnexoToDelete(anexo);
    setIsDeleteModalOpen(true);
  };

  // Guardar (Crear o Editar con token de autenticación)
  const handleFormSubmit = async (formData: AnexoInput) => {
    if (!isAuthenticated) return;

    if (anexoToEdit) {
      // Editar
      const updated = await anexoService.updateAnexo(
        anexoToEdit.id,
        formData,
        token,
      );
      setAnexos((prev) =>
        prev.map((item) => (item.id === anexoToEdit.id ? updated : item)),
      );
      showToast(`Anexo N° ${formData.anexo} actualizado correctamente.`);
    } else {
      // Crear
      const created = await anexoService.createAnexo(formData, token);
      setAnexos((prev) => [created, ...prev]);
      showToast(`Anexo N° ${formData.anexo} creado con éxito.`);
    }
  };

  // Confirmar eliminación (con token de autenticación)
  const handleDeleteConfirm = async () => {
    if (!anexoToDelete || !isAuthenticated) return;
    await anexoService.deleteAnexo(anexoToDelete.id, token);
    setAnexos((prev) => prev.filter((item) => item.id !== anexoToDelete.id));
    showToast(`Anexo N° ${anexoToDelete.anexo} eliminado.`, "success");
  };

  // Sectores únicos para filtro
  const sectores = useMemo(() => {
    const list = Array.from(
      new Set(anexos.map((a) => a.unidadServicio).filter(Boolean)),
    );
    return ["TODOS", ...list];
  }, [anexos]);

  // Lista filtrada
  const filteredAnexos = useMemo(() => {
    return [...anexos]
      .filter((item) => {
        const matchesSector =
          selectedSector === "TODOS" ||
          item.unidadServicio.toUpperCase() === selectedSector.toUpperCase();

        const query = searchQuery.toLowerCase().trim();

        const matchesSearch =
          !query ||
          item.anexo.toLowerCase().includes(query) ||
          item.ubicacion.toLowerCase().includes(query) ||
          item.unidadServicio.toLowerCase().includes(query) ||
          item.funcionarios.toLowerCase().includes(query);

        return matchesSector && matchesSearch;
      })
      .sort((a, b) => Number(a.anexo) - Number(b.anexo));
  }, [anexos, selectedSector, searchQuery]);

  // Métricas
  const totalAnexos = anexos.length;
  const totalSectores = useMemo(() => {
    return new Set(anexos.map((a) => a.unidadServicio)).size;
  }, [anexos]);

  const getSectorBadgeVariant = (unidad: string) => {
    const normalized = unidad.toUpperCase();
    if (normalized.includes("ROJO")) {
      return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30 font-semibold";
    }
    if (normalized.includes("VERDE")) {
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-semibold";
    }
    if (normalized.includes("AZUL")) {
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 font-semibold";
    }
    if (normalized.includes("AMARILLO")) {
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 font-semibold";
    }
    if (normalized.includes("TRANSVERSAL")) {
      return "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 font-semibold";
    }
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-xs font-medium flex items-center gap-2 animate-in slide-in-from-top-2 duration-300 ${
            toastMessage.type === "success"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
              : "bg-destructive/15 text-destructive border-destructive/30"
          }`}
        >
          <Check className="size-4" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <PhoneCall className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Directorio de Anexos
            </h1>
            <p className="text-muted-foreground text-sm">
              Gestione y consulte los anexos telefónicos, ubicación y personal
              del CESFAM.
            </p>
          </div>
        </div>

        {/* Botón Nuevo Anexo: Solo si está autenticado */}
        {isAuthenticated ? (
          <Button
            onClick={handleOpenCreateModal}
            className="h-10 gap-2 font-medium text-sm self-start sm:self-auto shadow-sm"
          >
            <Plus className="size-4" />
            Nuevo Anexo
          </Button>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-muted-foreground text-xs font-medium self-start sm:self-auto">
            <Lock className="size-3.5" />
            <span>Inicie sesión para administrar</span>
          </div>
        )}
      </div>

      {/* Alerta de Error de Conexión si Aplica */}
      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnexos}
            className="h-7 text-xs gap-1.5 border-amber-500/30 hover:bg-amber-500/10"
          >
            <RefreshCw className="size-3" /> Reintentar
          </Button>
        </div>
      )}

      {/* Tarjetas de Métricas */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Anexos"
          value={totalAnexos}
          loading={loading}
          icon={<Phone className="size-6" />}
          iconClassName="bg-primary/10 text-primary"
        />
        <MetricCard
          title="Unidades / Sectores"
          value={totalSectores}
          loading={loading}
          icon={<Building2 className="size-6" />}
          iconClassName="bg-emerald-500/10 text-emerald-500"
        />
      </div>

      {/* Contenedor Principal: Filtros y Tabla */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Controles de Búsqueda y Filtro */}
        <div className="p-6 border-b border-border space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Listado General de Anexos
              </h2>
              <p className="text-xs text-muted-foreground">
                {isAuthenticated
                  ? "Consulte, filtre, edite o elimine las extensiones telefónicas de la red."
                  : "Consulte y busque las extensiones telefónicas del CESFAM."}
              </p>
            </div>

            {/* Input de Búsqueda */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por anexo, sector, funcionario..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          {/* Filtro por Sectores (Pills) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 shrink-0 mr-1">
              <Layers className="size-3.5" /> Filtrar:
            </span>
            {sectores.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1 text-xs rounded-full border transition-all shrink-0 ${
                  selectedSector === sec
                    ? "bg-primary text-primary-foreground border-primary font-medium shadow-xs"
                    : "bg-background hover:bg-muted text-muted-foreground border-border"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Anexos */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[120px]">N° Anexo</TableHead>
                <TableHead className="min-w-[200px]">
                  Ubicación / Oficina
                </TableHead>
                <TableHead className="w-[180px]">Unidad / Servicio</TableHead>
                <TableHead className="min-w-[220px]">
                  Funcionario(s) Asignado(s)
                </TableHead>
                <TableHead className="w-[120px] text-right">
                  {isAuthenticated ? "Acciones" : "Copiar"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeletons de Carga
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-44" />
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-1">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      {isAuthenticated && (
                        <>
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredAnexos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No se encontraron anexos que coincidan con la búsqueda.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAnexos.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* N° Anexo */}
                    <TableCell>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary font-mono font-bold text-sm">
                        <Phone className="size-3.5" />
                        <span>{item.anexo}</span>
                      </div>
                    </TableCell>

                    {/* Ubicación / Oficina */}
                    <TableCell className="text-foreground font-medium text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-muted-foreground shrink-0" />
                        <span>{item.ubicacion}</span>
                      </div>
                    </TableCell>

                    {/* Unidad / Servicio */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2.5 py-0.5 border ${getSectorBadgeVariant(
                          item.unidadServicio,
                        )}`}
                      >
                        {item.unidadServicio}
                      </Badge>
                    </TableCell>

                    {/* Funcionario(s) Asignado(s) */}
                    <TableCell className="text-foreground/90 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground shrink-0" />
                        <span>{item.funcionarios}</span>
                      </div>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleCopyAnexo(item.anexo)}
                          title="Copiar Anexo"
                          className="inline-flex items-center justify-center size-8 rounded-md border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedAnexo === item.anexo ? (
                            <Check className="size-4 text-emerald-500" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </button>

                        {/* Editar y Eliminar: Solo para usuarios autenticados */}
                        {isAuthenticated && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              title="Editar Anexo"
                              className="inline-flex items-center justify-center size-8 rounded-md border border-border bg-background hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Pencil className="size-4" />
                            </button>

                            <button
                              onClick={() => handleOpenDeleteModal(item)}
                              title="Eliminar Anexo"
                              className="inline-flex items-center justify-center size-8 rounded-md border border-border bg-background hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </>
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

      {/* Modal Crear / Editar */}
      {isAuthenticated && (
        <AnexoModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          anexoToEdit={anexoToEdit}
        />
      )}

      {/* Modal Eliminar */}
      {isAuthenticated && (
        <DeleteAnexoModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          anexo={anexoToDelete}
        />
      )}
    </div>
  );
}
