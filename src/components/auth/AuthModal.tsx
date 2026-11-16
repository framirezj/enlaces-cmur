import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
  } = useAuth();

  const [rut, setRut] = useState("");
  const [pin, setPin] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setRut("");
    setPin("");
    setNombre("");
    setEmail("");
    setShowPin(false);
    setError(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      closeAuthModal();
    }
  };

  const handleSwitchMode = (mode: "login" | "register") => {
    setError(null);
    setShowPin(false);
    setPin("");
    openAuthModal(mode);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Aceptar solo números y máximo 4 dígitos
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(val);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!rut.trim()) {
      setError("Por favor ingresa tu RUT.");
      return;
    }
    if (pin.length !== 4) {
      setError("El PIN debe tener exactamente 4 dígitos numéricos.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ rut: rut.trim(), pin });
      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al iniciar sesión. Verifica tu RUT y PIN.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!rut.trim()) {
      setError("Por favor ingresa el RUT del funcionario.");
      return;
    }
    if (!nombre.trim()) {
      setError("Por favor ingresa el nombre completo.");
      return;
    }
    if (pin.length !== 4) {
      setError("El PIN debe tener exactamente 4 dígitos numéricos.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        rut: rut.trim(),
        nombre: nombre.trim(),
        pin,
        email: email.trim() || undefined,
        rol: "usuario",
      });
      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al registrar funcionario.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLogin = authModalMode === "login";

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-6 overflow-hidden">
        <DialogHeader className="space-y-2 text-center items-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs mb-1">
            {isLogin ? <KeyRound className="size-6" /> : <ShieldCheck className="size-6" />}
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {isLogin ? "Iniciar Sesión" : "Registro de Funcionario"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-center max-w-xs">
            {isLogin
              ? "Ingresa tu RUT y tu PIN de 4 dígitos para acceder al sistema CESFAM."
              : "Registra tu cuenta institucional para sincronizar tus enlaces y favoritos."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs animate-in fade-in-50">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{error}</span>
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            {/* Campo RUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-muted-foreground" />
                RUT
              </label>
              <Input
                type="text"
                placeholder="12.345.678-9 o 12345678-9"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                disabled={isSubmitting}
                autoFocus
                className="h-10 text-sm"
              />
            </div>

            {/* Campo PIN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Lock className="size-3.5 text-muted-foreground" />
                  PIN de 4 dígitos
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {pin.length}/4
                </span>
              </div>
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={4}
                  pattern="\d{4}"
                  placeholder="••••"
                  value={pin}
                  onChange={handlePinChange}
                  disabled={isSubmitting}
                  className="h-10 text-center tracking-[0.4em] font-mono text-base pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
                >
                  {showPin ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Ingresa tu clave numérica personal de 4 dígitos.
              </p>
            </div>

            {/* Botón Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !rut.trim() || pin.length !== 4}
              className="w-full h-10 mt-2 font-medium cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Ingresar al Sistema"
              )}
            </Button>

            {/* Switch a Registro */}
            <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
              ¿No tienes una cuenta registrada aún?{" "}
              <button
                type="button"
                onClick={() => handleSwitchMode("register")}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Regístrate aquí
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 pt-2">
            {/* Campo RUT */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-muted-foreground" />
                RUT
              </label>
              <Input
                type="text"
                placeholder="11.222.333-4"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                disabled={isSubmitting}
                autoFocus
                className="h-9 text-sm"
              />
            </div>

            {/* Campo Nombre Completo */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Nombre Completo
              </label>
              <Input
                type="text"
                placeholder="Ej. Dr. Carlos Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={isSubmitting}
                className="h-9 text-sm"
              />
            </div>

            {/* Campo Email (opcional) */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" />
                Correo Electrónico <span className="text-muted-foreground text-[10px]">(opcional)</span>
              </label>
              <Input
                type="email"
                placeholder="cperez@cesfam.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="h-9 text-sm"
              />
            </div>

            {/* Campo PIN */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Lock className="size-3.5 text-muted-foreground" />
                  PIN Numérico (4 dígitos)
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {pin.length}/4
                </span>
              </div>
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={4}
                  pattern="\d{4}"
                  placeholder="••••"
                  value={pin}
                  onChange={handlePinChange}
                  disabled={isSubmitting}
                  className="h-9 text-center tracking-[0.4em] font-mono text-base pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
                >
                  {showPin ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Botón Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !rut.trim() || !nombre.trim() || pin.length !== 4}
              className="w-full h-10 mt-3 font-medium cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta e Iniciar Sesión"
              )}
            </Button>

            {/* Switch a Login */}
            <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
              ¿Ya estás registrado?{" "}
              <button
                type="button"
                onClick={() => handleSwitchMode("login")}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Inicia sesión aquí
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
