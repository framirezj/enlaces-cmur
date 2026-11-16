import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  UserRole,
  Usuario,
} from "@/types/auth.types";
import { authService } from "@/services/authService";

export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Control de estado del Modal de Autenticación
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  const openAuthModal = useCallback((mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Intentar cargar la sesión guardada al iniciar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("auth_token");
      if (storedToken) {
        try {
          const userData = await authService.getCurrentUser(storedToken);
          setToken(storedToken);
          setUser(userData);
        } catch (error) {
          console.error("Error al restaurar sesión:", error);
          localStorage.removeItem("auth_token");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setToken(data.access_token);
      setUser(data.usuario);
      localStorage.setItem("auth_token", data.access_token);
      setIsAuthModalOpen(false);
      return data;
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    setIsLoading(true);
    try {
      // 1. Registro del funcionario en el backend
      await authService.register(payload);
      // 2. Inicio de sesión automático inmediato
      const loginData = await authService.login({
        rut: payload.rut,
        pin: payload.pin,
      });
      setToken(loginData.access_token);
      setUser(loginData.usuario);
      localStorage.setItem("auth_token", loginData.access_token);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error("Error durante el registro:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
  }, []);

  const hasRole = useCallback(
    (requiredRole: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(user.rol);
      }
      return user.rol === requiredRole;
    },
    [user]
  );

  const isAuthenticated = Boolean(user && token);
  const isAdmin = user?.rol === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
