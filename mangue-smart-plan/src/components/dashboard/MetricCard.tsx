import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "accent" | "warning";
}

const variantStyles = {
  default: {
    iconBg: "bg-secondary",
    iconColor: "text-primary",
  },
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  accent: {
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  warning: {
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
};

export function MetricCard({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon: Icon,
  variant = "default",
}: MetricCardProps) {
  const styles = variantStyles[variant];
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 group">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-foreground">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  isPositive && "text-success",
                  isNegative && "text-destructive",
                  !isPositive && !isNegative && "text-muted-foreground"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : isNegative ? (
                  <TrendingDown className="w-4 h-4" />
                ) : null}
                <span>{isPositive ? "+" : ""}{change}%</span>
              </div>
              {changeLabel && (
                <span className="text-xs text-muted-foreground">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
            styles.iconBg
          )}
        >
          <Icon className={cn("w-6 h-6", styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
