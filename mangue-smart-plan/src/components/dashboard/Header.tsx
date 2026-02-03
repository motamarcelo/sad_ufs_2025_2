import { Bell, Search, Calendar, HelpCircle } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Date */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">{today}</span>
          </div>

          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar dados..."
              className="pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
