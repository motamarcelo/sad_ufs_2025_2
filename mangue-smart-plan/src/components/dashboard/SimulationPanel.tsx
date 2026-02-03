import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Play, RotateCcw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulationParams {
  densidade: number;
  novaVia: number;
  areaVerde: number;
  transporte: number;
}

interface ImpactResult {
  indicador: string;
  atual: number;
  projetado: number;
  variacao: number;
}

const defaultParams: SimulationParams = {
  densidade: 0,
  novaVia: 0,
  areaVerde: 0,
  transporte: 0,
};

export function SimulationPanel() {
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [isSimulating, setIsSimulating] = useState(false);
  const [impacts, setImpacts] = useState<ImpactResult[]>([]);

  const calculateImpacts = () => {
    const { densidade, novaVia, areaVerde, transporte } = params;
    
    return [
      {
        indicador: "Índice de Verticalização",
        atual: 65,
        projetado: Math.min(100, Math.round(65 + densidade * 0.5 - areaVerde * 0.1)),
        variacao: Math.round(densidade * 0.5 - areaVerde * 0.1),
      },
      {
        indicador: "Cobertura de Infraestrutura",
        atual: 78,
        projetado: Math.min(100, Math.round(78 + novaVia * 0.3 + transporte * 0.2)),
        variacao: Math.round(novaVia * 0.3 + transporte * 0.2),
      },
      {
        indicador: "Mobilidade Periférica",
        atual: 61,
        projetado: Math.min(100, Math.round(61 + novaVia * 0.4 + transporte * 0.3 - densidade * 0.15)),
        variacao: Math.round(novaVia * 0.4 + transporte * 0.3 - densidade * 0.15),
      },
      {
        indicador: "Qualidade Ambiental",
        atual: 72,
        projetado: Math.min(100, Math.round(72 + areaVerde * 0.5 - densidade * 0.2)),
        variacao: Math.round(areaVerde * 0.5 - densidade * 0.2),
      },
    ];
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setImpacts(calculateImpacts());
      setIsSimulating(false);
    }, 800);
  };

  const resetSimulation = () => {
    setParams(defaultParams);
    setImpacts([]);
  };

  useEffect(() => {
    if (Object.values(params).some(v => v !== 0)) {
      const timer = setTimeout(runSimulation, 500);
      return () => clearTimeout(timer);
    }
  }, [params]);

  const sliders = [
    { key: "densidade", label: "Aumento de Densidade", unit: "%", color: "bg-chart-1" },
    { key: "novaVia", label: "Nova Via de Acesso", unit: "km", color: "bg-chart-2" },
    { key: "areaVerde", label: "Expansão de Áreas Verdes", unit: "ha", color: "bg-chart-3" },
    { key: "transporte", label: "Melhoria no Transporte", unit: "%", color: "bg-chart-4" },
  ];

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            Simulação de Cenários
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Ajuste os parâmetros e visualize o impacto nos indicadores
          </p>
        </div>
        <button
          onClick={resetSimulation}
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Resetar
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-6 mb-8">
        {sliders.map(({ key, label, unit, color }) => (
          <div key={key} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{label}</label>
              <span className="text-sm font-semibold text-primary">
                +{params[key as keyof SimulationParams]} {unit}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className={cn("w-3 h-3 rounded-sm", color)} />
              <Slider
                value={[params[key as keyof SimulationParams]]}
                onValueChange={([value]) =>
                  setParams((prev) => ({ ...prev, [key]: value }))
                }
                max={100}
                step={5}
                className="flex-1"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Run Simulation Button */}
      <button
        onClick={runSimulation}
        disabled={isSimulating}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Play className={cn("w-5 h-5", isSimulating && "animate-pulse")} />
        {isSimulating ? "Simulando..." : "Executar Simulação"}
      </button>

      {/* Impact Results */}
      {impacts.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Impacto Projetado
          </h4>
          <div className="space-y-3">
            {impacts.map((impact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {impact.indicador}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Atual: {impact.atual}% → Projetado: {impact.projetado}%
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                    impact.variacao > 0 && "bg-success/10 text-success",
                    impact.variacao < 0 && "bg-destructive/10 text-destructive",
                    impact.variacao === 0 && "bg-secondary text-muted-foreground"
                  )}
                >
                  {impact.variacao > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : impact.variacao < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                  <span>
                    {impact.variacao > 0 ? "+" : ""}
                    {impact.variacao}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
