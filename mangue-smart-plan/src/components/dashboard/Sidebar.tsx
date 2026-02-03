import { Map, BarChart3, SlidersHorizontal, FileText, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "mapa", label: "Mapa Urbano", icon: Map },
  { id: "indicadores", label: "Indicadores", icon: BarChart3 },
  { id: "simulacao", label: "Simulação de Cenários", icon: SlidersHorizontal },
  { id: "relatorios", label: "Relatórios", icon: FileText },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-display font-bold text-sidebar-foreground">
                MangueSMART
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Planejamento Urbano</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-primary"
              )} />
              {!collapsed && (
                <span className="text-sm font-medium truncate animate-fade-in">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-semibold text-sidebar-primary">MS</span>
          </div>
          {!collapsed && (
            <div className="animate-fade-in overflow-hidden">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Mariana Souza</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Gestora de Planejamento</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-secondary transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-foreground" />
        )}
      </button>
    </aside>
  );
}
