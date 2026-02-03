import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MapPlaceholder } from "@/components/dashboard/MapPlaceholder";
import { UrbanGrowthChart } from "@/components/dashboard/UrbanGrowthChart";
import { SimulationPanel } from "@/components/dashboard/SimulationPanel";
import { Building2, Network, Car, FileBarChart, AlertTriangle, Users } from "lucide-react";

const viewConfig: Record<string, { title: string; subtitle: string }> = {
  mapa: {
    title: "Mapa Urbano",
    subtitle: "Visualização geoespacial de Aracaju, SE - Camadas interativas",
  },
  indicadores: {
    title: "Indicadores",
    subtitle: "Métricas de desenvolvimento urbano e sustentabilidade",
  },
  simulacao: {
    title: "Simulação de Cenários",
    subtitle: "Projeção de impactos de políticas urbanas",
  },
  relatorios: {
    title: "Relatórios",
    subtitle: "Exportação e análise de dados consolidados",
  },
};

const Index = () => {
  const [activeView, setActiveView] = useState("mapa");
  const config = viewConfig[activeView];

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <div className="relative">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={config.title} subtitle={config.subtitle} />

        <main
          className={`flex-1 p-6 min-h-0 ${
            activeView === "mapa" ? "overflow-hidden" : "overflow-auto"
          }`}
        >
          {activeView === "mapa" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full min-h-0">
              {/* Map Area - Full height */}
              <div className="xl:col-span-2 h-full min-h-0">
                <MapPlaceholder />
              </div>

              {/* Side Panel */}
              <div className="space-y-6 overflow-auto max-h-full pr-1">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-4">
                  <MetricCard
                    title="Índice de Verticalização"
                    value={65}
                    unit="%"
                    change={12.5}
                    changeLabel="vs. ano anterior"
                    icon={Building2}
                    variant="primary"
                  />
                  <MetricCard
                    title="Cobertura de Infraestrutura"
                    value={78}
                    unit="%"
                    change={5.2}
                    changeLabel="vs. ano anterior"
                    icon={Network}
                    variant="accent"
                  />
                  <MetricCard
                    title="Mobilidade Periférica"
                    value={61}
                    unit="%"
                    change={-2.1}
                    changeLabel="vs. ano anterior"
                    icon={Car}
                    variant="warning"
                  />
                </div>

                {/* Alert Card */}
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-destructive/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Atenção: Zona de Risco
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        3 áreas identificadas com risco de alagamento no período chuvoso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "indicadores" && (
            <div className="space-y-6 animate-fade-in">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Índice de Verticalização"
                  value={65}
                  unit="%"
                  change={12.5}
                  changeLabel="vs. ano anterior"
                  icon={Building2}
                  variant="primary"
                />
                <MetricCard
                  title="Cobertura de Infraestrutura"
                  value={78}
                  unit="%"
                  change={5.2}
                  changeLabel="vs. ano anterior"
                  icon={Network}
                  variant="accent"
                />
                <MetricCard
                  title="Mobilidade Periférica"
                  value={61}
                  unit="%"
                  change={-2.1}
                  changeLabel="vs. ano anterior"
                  icon={Car}
                  variant="warning"
                />
                <MetricCard
                  title="População Atendida"
                  value="657K"
                  change={3.8}
                  changeLabel="crescimento anual"
                  icon={Users}
                  variant="default"
                />
              </div>

              {/* Chart */}
              <UrbanGrowthChart />
            </div>
          )}

          {activeView === "simulacao" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              <SimulationPanel />
              <div className="space-y-6">
                <UrbanGrowthChart />
                <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-4">
                    Cenários Salvos
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "Expansão Norte", date: "15/01/2025", status: "Aprovado" },
                      { name: "Nova Via Sul", date: "10/01/2025", status: "Em análise" },
                      { name: "Área Verde Central", date: "05/01/2025", status: "Pendente" },
                    ].map((scenario, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {scenario.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {scenario.date}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            scenario.status === "Aprovado"
                              ? "bg-success/10 text-success"
                              : scenario.status === "Em análise"
                              ? "bg-warning/10 text-warning"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {scenario.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "relatorios" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Relatório Mensal de Indicadores",
                    description: "Análise consolidada de todos os indicadores urbanos",
                    date: "Janeiro 2025",
                    type: "PDF",
                  },
                  {
                    title: "Mapa de Zonas de Risco",
                    description: "Áreas identificadas com vulnerabilidade ambiental",
                    date: "Janeiro 2025",
                    type: "GeoJSON",
                  },
                  {
                    title: "Projeção de Crescimento 2025-2030",
                    description: "Cenários de desenvolvimento urbano para os próximos 5 anos",
                    date: "Janeiro 2025",
                    type: "XLSX",
                  },
                  {
                    title: "Análise de Mobilidade",
                    description: "Fluxo de transporte público e privado na região metropolitana",
                    date: "Dezembro 2024",
                    type: "PDF",
                  },
                  {
                    title: "Uso do Solo - Atualização",
                    description: "Classificação atualizada das zonas urbanas",
                    date: "Dezembro 2024",
                    type: "Shapefile",
                  },
                  {
                    title: "Dashboard Executivo",
                    description: "Resumo visual para apresentação à gestão",
                    date: "Dezembro 2024",
                    type: "PPTX",
                  },
                ].map((report, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-card-hover transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <FileBarChart className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full font-medium text-muted-foreground">
                        {report.type}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-foreground mb-2">
                      {report.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {report.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
