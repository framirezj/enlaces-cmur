import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCw,
  ExternalLink,
  Maximize2,
  Minimize2,
  Sparkles,
  Check,
  Copy,
  AlertCircle,
  Bot,
  HeartHandshake,
} from "lucide-react";

export function BienestarPage() {
  const TARGET_URL = "http://bienestar.cesfam.local/";
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(TARGET_URL, "_blank", "noopener,noreferrer");
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(TARGET_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`flex flex-col gap-4 transition-all duration-300 ${isExpanded ? "h-[calc(100vh-85px)]" : "h-[calc(100vh-140px)]"}`}>
      {/* Header bar con controles del RAG de Bienestar */}
      <Card className="shadow-xs border-border bg-card">
        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Bot className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg font-bold">RAG Bienestar Funcionarios</CardTitle>
                <Badge variant="outline" className="gap-1 text-xs font-normal border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="size-3" /> Asistente IA (RAG)
                </Badge>
                <Badge variant="outline" className="gap-1 text-xs font-normal border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <HeartHandshake className="size-3" /> Beneficios al Trabajador
                </Badge>
              </div>
              <CardDescription className="text-xs flex items-center gap-2 mt-1">
                <span>Consultas sobre convenios, apoyos y beneficios del personal CESFAM</span>
                <span className="text-muted-foreground">•</span>
                <span className="font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded text-[11px]">
                  {TARGET_URL}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Copiar enlace"
                >
                  {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>
              </CardDescription>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-8 gap-1.5 text-xs"
              title="Recargar asistente RAG"
            >
              <RotateCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Recargar</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenExternal}
              className="h-8 gap-1.5 text-xs"
              title="Abrir en nueva pestaña"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">Abrir en pestaña</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleExpand}
              className="h-8 w-8"
              title={isExpanded ? "Reducir tamaño" : "Ampliar pantalla"}
            >
              {isExpanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Contenedor del Iframe RAG con indicador de carga */}
      <div className="relative flex-1 w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs gap-3">
            <div className="size-10 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center animate-bounce">
              <Bot className="size-6" />
            </div>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <p className="text-sm font-medium text-muted-foreground">Iniciando sistema RAG Bienestar...</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={TARGET_URL}
          title="RAG Bienestar Funcionarios CESFAM"
          className="w-full h-full border-0 flex-1 bg-white"
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />

        {/* Banner de ayuda al pie */}
        <div className="px-4 py-2 bg-muted/40 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2 truncate">
            <AlertCircle className="size-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              ¿No se despliega la interfaz del RAG? Asegúrate de estar conectado a la red local <code className="text-foreground font-mono">bienestar.cesfam.local</code> o abre la aplicación en una nueva pestaña.
            </span>
          </div>
          <button
            onClick={handleOpenExternal}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium ml-2 shrink-0 flex items-center gap-1"
          >
            Abrir RAG <ExternalLink className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
