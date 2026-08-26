import React, { useState, useEffect } from "react";
import type { Anexo, AnexoInput } from "@/types/anexo.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Loader2, Phone, MapPin, Building2, Users } from "lucide-react";

interface AnexoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AnexoInput) => Promise<void>;
  anexoToEdit?: Anexo | null;
}

const SECTOR_OPTIONS = [
  "SECTOR ROJO",
  "SECTOR VERDE",
  "SECTOR AZUL",
  "SECTOR AMARILLO",
  "SECTOR TRANSVERSAL",
];

export function AnexoModal({
  isOpen,
  onClose,
  onSubmit,
  anexoToEdit,
}: AnexoModalProps) {
  const [formData, setFormData] = useState<AnexoInput>({
    anexo: "",
    ubicacion: "",
    unidadServicio: "SECTOR ROJO",
    funcionarios: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (anexoToEdit) {
      setFormData({
        anexo: anexoToEdit.anexo,
        ubicacion: anexoToEdit.ubicacion,
        unidadServicio: anexoToEdit.unidadServicio,
        funcionarios: anexoToEdit.funcionarios,
      });
    } else {
      setFormData({
        anexo: "",
        ubicacion: "",
        unidadServicio: "SECTOR ROJO",
        funcionarios: "",
      });
    }
    setError(null);
  }, [anexoToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.anexo.trim()) {
      setError("El número de anexo es obligatorio.");
      return;
    }
    if (!formData.ubicacion.trim()) {
      setError("La ubicación es obligatoria.");
      return;
    }
    if (!formData.funcionarios.trim()) {
      setError("Indique el o los funcionarios asignados.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar el anexo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden text-card-foreground">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Phone className="size-4" />
            </div>
            <h3 className="text-base font-semibold">
              {anexoToEdit ? "Editar Anexo Telefónico" : "Nuevo Anexo Telefónico"}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          {/* Campo: N° Anexo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Phone className="size-3.5 text-muted-foreground" />
              N° Anexo / Extensión *
            </label>
            <Input
              type="text"
              placeholder="Ej: 101, 202, 305"
              value={formData.anexo}
              onChange={(e) => setFormData({ ...formData, anexo: e.target.value })}
              className="text-sm font-mono"
              required
            />
          </div>

          {/* Campo: Ubicación / Oficina */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-muted-foreground" />
              Ubicación / Oficina *
            </label>
            <Input
              type="text"
              placeholder="Ej: Segundo Piso, Ala Norte"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              className="text-sm"
              required
            />
          </div>

          {/* Campo: Unidad / Servicio */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5 text-muted-foreground" />
              Unidad / Servicio *
            </label>
            <Input
              type="text"
              placeholder="Ej: SECTOR ROJO"
              value={formData.unidadServicio}
              onChange={(e) => setFormData({ ...formData, unidadServicio: e.target.value })}
              className="text-sm uppercase font-semibold"
              required
            />
            {/* Opciones rápidas */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SECTOR_OPTIONS.map((sec) => (
                <button
                  type="button"
                  key={sec}
                  onClick={() => setFormData({ ...formData, unidadServicio: sec })}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    formData.unidadServicio.toUpperCase() === sec
                      ? "bg-primary/10 text-primary border-primary/40 font-semibold"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Campo: Funcionario(s) Asignado(s) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Users className="size-3.5 text-muted-foreground" />
              Funcionario(s) Asignado(s) *
            </label>
            <Input
              type="text"
              placeholder="Ej: Dr. Rojas / Enfermera María"
              value={formData.funcionarios}
              onChange={(e) => setFormData({ ...formData, funcionarios: e.target.value })}
              className="text-sm"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 text-xs gap-1.5"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              {anexoToEdit ? "Guardar Cambios" : "Crear Anexo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
