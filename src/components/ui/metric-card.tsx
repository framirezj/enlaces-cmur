import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  loading?: boolean;
  iconClassName?: string;
  className?: string;
}

/**
 * Componente reutilizable para tarjetas de métricas / estadísticas rápidas
 */
export function MetricCard({
  title,
  value,
  icon,
  loading = false,
  iconClassName = "bg-primary/10 text-primary",
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-xs flex items-center gap-4 transition-all duration-200 hover:border-border/80",
        className
      )}
    >
      <div className={cn("p-3 rounded-lg shrink-0 flex items-center justify-center", iconClassName)}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <div className="text-2xl font-bold text-foreground leading-none">
          {loading ? <Skeleton className="h-7 w-12" /> : value}
        </div>
      </div>
    </div>
  );
}
