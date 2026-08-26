import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { InicioPage } from "@/components/home/InicioPage";
import { BienestarPage } from "@/components/bienestar/BienestarPage";
import { AnexosPage } from "@/components/anexos/AnexosPage";
import Layout from "../layouts/Layout";
import { EnlacesPage } from "@/components/enlaces/EnlacesPage";

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
          element: <InicioPage />,
        },
        {
          path: "/bienestar",
          element: <BienestarPage />,
        },
        {
          path: "/dashboard",
          element: <p>Dashboard</p>,
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
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
