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
import {
  Home,
  PhoneCall,
  List,
  LogOut,
  LogIn,
  ChevronsUpDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const { user, logout, openAuthModal, isLoading, isAdmin } = useAuth();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getInitials = (nombre: string) => {
    return nombre
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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
              {/* <SidebarMenuItem>
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
              </SidebarMenuItem> */}

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
      <SidebarFooter className="p-3 border-t border-sidebar-border flex flex-col items-center justify-center">
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
                {user.foto_url ? (
                  <img
                    src={user.foto_url}
                    alt={user.nombre}
                    className="h-8 w-8 rounded-full object-cover border border-sidebar-border shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/25 shrink-0">
                    {getInitials(user.nombre)}
                  </div>
                )}

                {!isCollapsed && (
                  <div className="flex flex-1 flex-col text-sm leading-tight min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold truncate">
                        {user.nombre}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {user.rut || user.email}
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
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-none truncate">
                      {user.nombre}
                    </p>
                    <Badge
                      variant={isAdmin ? "default" : "secondary"}
                      className="text-[10px] h-4 px-1.5"
                    >
                      {isAdmin ? "Admin" : "Funcionario"}
                    </Badge>
                  </div>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    RUT: {user.rut}
                  </p>
                  {user.email && (
                    <p className="text-[11px] leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  )}
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
        ) : isCollapsed ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openAuthModal("login")}
            className="size-8 rounded-lg cursor-pointer hover:bg-sidebar-accent"
            title="Iniciar sesión"
          >
            <LogIn className="size-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => openAuthModal("login")}
            className="w-full justify-center gap-2 cursor-pointer shadow-xs border-sidebar-border hover:bg-sidebar-accent"
          >
            <LogIn className="size-4 text-primary" />
            <span>Iniciar sesión</span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
