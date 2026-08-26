import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bot, PhoneCall, List, ArrowRight, Activity, Users, ShieldCheck, Sparkles } from "lucide-react";

export function InicioPage() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Hero Welcome Card */}
      <Card className="border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-sm">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> Portal Intranet CESFAM
            </span>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Bienvenido al Sistema CESFAM
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-2xl mt-2">
            Plataforma centralizada para la gestión de anexos, enlaces institucionales y acceso al asistente de Inteligencia Artificial (RAG) para beneficios de los trabajadores.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-2">
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2 shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link to="/bienestar">
                <Bot className="size-4" /> Consultar RAG Bienestar
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/anexos">
                <PhoneCall className="size-4" /> Ver Anexos
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-indigo-500/50 transition-all duration-200 hover:shadow-md flex flex-col justify-between">
          <CardHeader>
            <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
              <Bot className="size-6" />
            </div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">RAG Bienestar</CardTitle>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="size-2.5" /> IA
              </span>
            </div>
            <CardDescription>
              Asistente virtual de Inteligencia Artificial para consultas de beneficios, convenios y servicios al trabajador del CESFAM.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild variant="ghost" className="w-full justify-between hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Link to="/bienestar">
                <span>Ir al Asistente RAG</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

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
            <Button asChild variant="ghost" className="w-full justify-between hover:bg-blue-500/10 text-blue-600 dark:text-blue-400">
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
              Accesos directos a sistemas externos y plataformas del servicio de salud.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild variant="ghost" className="w-full justify-between hover:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Link to="/enlaces">
                <span>Ver Enlaces</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de estado */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
          <Activity className="size-5 text-primary shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">Estado del Sistema</p>
            <p className="text-muted-foreground">Operativo</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
          <Users className="size-5 text-primary shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">Programa PSCV</p>
            <p className="text-muted-foreground">CESFAM</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
          <ShieldCheck className="size-5 text-emerald-500 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">Red Intranet</p>
            <p className="text-muted-foreground">Conexión Local Activa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
