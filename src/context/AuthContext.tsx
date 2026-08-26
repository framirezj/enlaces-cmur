import React, { createContext, useState, useEffect, type ReactNode } from "react";
import type { Usuario } from "@/types/auth.types";
import { authService } from "@/services/authService";

export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isLoading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const loginWithGoogle = async (idToken: string) => {
    setIsLoading(true);
    try {
      const data = await authService.loginWithGoogle(idToken);
      setToken(data.access_token);
      setUser(data.usuario);
      localStorage.setItem("auth_token", data.access_token);
    } catch (error) {
      console.error("Error durante el login con Google:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
