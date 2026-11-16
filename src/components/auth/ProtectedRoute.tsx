import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth.types";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-sm font-medium">Verificando credenciales...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto space-y-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
          <ShieldAlert className="size-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">Acceso Requerido</h2>
          <p className="text-xs text-muted-foreground">
            Debes iniciar sesión con tu RUT y PIN para acceder a este contenido.
          </p>
        </div>
        <Button onClick={() => openAuthModal("login")} className="cursor-pointer">
          Iniciar Sesión
        </Button>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto space-y-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <ShieldAlert className="size-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">Acceso Denegado</h2>
          <p className="text-xs text-muted-foreground">
            Se requiere rol de administrador ({allowedRoles.join(", ")}) para acceder a esta sección.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()} className="cursor-pointer">
          Volver
        </Button>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
