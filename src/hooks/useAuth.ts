import { useContext } from "react";
import { AuthContext, type AuthContextType } from "@/context/AuthContext";

/**
 * Hook para acceder fácilmente al estado y métodos de autenticación.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};
