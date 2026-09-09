import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, PhoneCall, List, LogOut, ChevronsUpDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const location = useLocation();
  const { user, logout, loginWithGoogle, isLoading } = useAuth();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solo inicializar si no hay un usuario autenticado
    if (user) return;

    const initializeGoogleSignIn = () => {
      const g = (window as any).google;
      if (g && g.accounts && g.accounts.id) {
        g.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
          callback: async (response: any) => {
            try {
              await loginWithGoogle(response.credential);
            } catch (err) {
              console.error("Error al iniciar sesión con Google:", err);
            }
          },
        });

        if (googleButtonRef.current) {
          g.accounts.id.renderButton(googleButtonRef.current, {
            type: isCollapsed ? "icon" : "standard",
            theme: "outline",
            size: "medium",
            shape: "pill",
            logo_alignment: "left",
          });
        }
      }
    };

    let intervalId: any;
    const g = (window as any).google;
    if (g && g.accounts && g.accounts.id) {
      initializeGoogleSignIn();
    } else {
      intervalId = setInterval(() => {
        const g2 = (window as any).google;
        if (g2 && g2.accounts && g2.accounts.id) {
          initializeGoogleSignIn();
          clearInterval(intervalId);
        }
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, loginWithGoogle, isCollapsed]);

  return (
    <Sidebar>
      {/* Header del Sidebar con el Logo y selector de tema */}
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none">CESFAM</span>
              <span className="text-xs text-muted-foreground">
                Marta Ugarte R.
              </span>
            </div>
          </div>
          <ModeToggle />
        </div>
      </SidebarHeader>

      {/* Contenido con opciones del Menú */}
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Inicio"
                  isActive={location.pathname === "/"}
                >
                  <Link to="/" className="flex items-center gap-3">
                    <Home className="size-4" />
                    <span>Inicio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Enlaces"
                  isActive={location.pathname === "/enlaces"}
                >
                  <Link to="/enlaces" className="flex items-center gap-3">
                    <List className="size-4" />
                    <span>Enlaces</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Anexos"
                  isActive={location.pathname === "/anexos"}
                >
                  <Link to="/anexos" className="flex items-center gap-3">
                    <PhoneCall className="size-4" />
                    <span>Anexos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer con estado de Autenticación */}
      <SidebarFooter className="p-4 border-t border-sidebar-border flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex items-center gap-3 px-1 py-1.5 w-full">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent animate-pulse shrink-0" />
            {!isCollapsed && (
              <div className="flex flex-col gap-1.5 w-full">
                <div className="h-3 w-20 bg-sidebar-accent animate-pulse rounded" />
                <div className="h-2 w-28 bg-sidebar-accent animate-pulse rounded" />
              </div>
            )}
          </div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg p-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left focus:outline-hidden transition-colors cursor-pointer">
                <img
                  src={user.foto_url}
                  alt={user.nombre}
                  className="h-8 w-8 rounded-full object-cover border border-sidebar-border shrink-0"
                  referrerPolicy="no-referrer"
                />
                {!isCollapsed && (
                  <div className="flex flex-1 flex-col text-sm leading-tight min-w-0">
                    <span className="font-semibold truncate">
                      {user.nombre}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  </div>
                )}
                {!isCollapsed && (
                  <ChevronsUpDown className="size-4 text-muted-foreground shrink-0" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={isMobile ? "bottom" : "top"}
              align="end"
              className="w-56"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.nombre}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex justify-center w-full py-1">
            <div ref={googleButtonRef} className="min-h-9" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
