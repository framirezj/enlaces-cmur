import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
//import { InicioPage } from "@/components/home/InicioPage";
import { BienestarPage } from "@/components/bienestar/BienestarPage";
import { AnexosPage } from "@/components/anexos/AnexosPage";
import Layout from "../layouts/Layout";
import { EnlacesPage } from "@/components/enlaces/EnlacesPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const router = createBrowserRouter(
  [
    {
      element: (
        <Layout>
          <Outlet />
        </Layout>
      ),
      children: [
        {
          path: "/",
          element: <EnlacesPage />, //<InicioPage />,
        },
        {
          path: "/bienestar",
          element: <BienestarPage />,
        },
        {
          path: "/anexos",
          element: <AnexosPage />,
        },
        {
          path: "/personas",
          element: <Navigate to="/anexos" replace />,
        },
        {
          path: "/enlaces",
          element: <EnlacesPage />,
        },
        // Rutas protegidas exclusivas para Administradores
        {
          element: <ProtectedRoute allowedRoles={["admin"]} />,
          children: [
            {
              path: "/dashboard",
              element: (
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-2">
                    Panel de Administración
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Bienvenido al panel exclusivo para administradores del
                    CESFAM.
                  </p>
                </div>
              ),
            },
          ],
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
