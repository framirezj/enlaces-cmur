import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PhoneCall, List, ArrowRight, ShieldCheck } from "lucide-react";

export function InicioPage() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Hero Welcome Card */}
      <Card className="border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-sm">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> Portal CESFAM Marta Ugarte
            </span>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Bienvenido 👋
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-2xl mt-2">
            Plataforma centralizada para la gestión de anexos, enlaces
            institucionales y más..
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Grid de Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-primary/50 transition-all duration-200 hover:shadow-md flex flex-col justify-between">
          <CardHeader>
            <div className="size-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
              <PhoneCall className="size-6" />
            </div>
            <CardTitle className="text-xl">Directorio de Anexos</CardTitle>
            <CardDescription>
              Directorio telefónico interno y anexos de funcionarios del CESFAM.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-between hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
            >
              <Link to="/anexos">
                <span>Ver Anexos</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-all duration-200 hover:shadow-md flex flex-col justify-between">
          <CardHeader>
            <div className="size-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
              <List className="size-6" />
            </div>
            <CardTitle className="text-xl">Enlaces de Interés</CardTitle>
            <CardDescription>
              Accesos directos a sistemas externos y plataformas del servicio de
              salud.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-between hover:bg-purple-500/10 text-purple-600 dark:text-purple-400"
            >
              <Link to="/enlaces">
                <span>Ver Enlaces</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
