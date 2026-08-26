import { useState } from "react";
import type { Anexo } from "@/types/anexo.types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteAnexoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  anexo: Anexo | null;
}

export function DeleteAnexoModal({
  isOpen,
  onClose,
  onConfirm,
  anexo,
}: DeleteAnexoModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !anexo) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al eliminar el anexo");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-card border border-border rounded-xl shadow-xl overflow-hidden text-card-foreground">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-destructive/5">
          <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
            <AlertTriangle className="size-4" />
            <span>Eliminar Anexo</span>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed">
            ¿Está seguro de que desea eliminar el anexo{" "}
            <strong className="text-foreground font-mono font-bold">N° {anexo.anexo}</strong> (
            {anexo.ubicacion})? Esta acción no se puede deshacer.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="h-8 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 text-xs gap-1.5"
            >
              {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
