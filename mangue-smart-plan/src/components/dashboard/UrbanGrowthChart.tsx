import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { year: "2020", verticalizacao: 32, infraestrutura: 58, mobilidade: 42 },
  { year: "2021", verticalizacao: 38, infraestrutura: 61, mobilidade: 45 },
  { year: "2022", verticalizacao: 45, infraestrutura: 65, mobilidade: 48 },
  { year: "2023", verticalizacao: 52, infraestrutura: 70, mobilidade: 52 },
  { year: "2024", verticalizacao: 58, infraestrutura: 73, mobilidade: 55 },
  { year: "2025", verticalizacao: 65, infraestrutura: 78, mobilidade: 61 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function UrbanGrowthChart() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground">
          Evolução do Crescimento Urbano
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Indicadores dos últimos 5 anos - Aracaju, SE
        </p>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorVerticalizacao" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(215, 50%, 35%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(215, 50%, 35%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInfraestrutura" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152, 45%, 40%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(152, 45%, 40%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMobilidade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="verticalizacao"
              name="Verticalização"
              stroke="hsl(215, 50%, 35%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVerticalizacao)"
            />
            <Area
              type="monotone"
              dataKey="infraestrutura"
              name="Infraestrutura"
              stroke="hsl(152, 45%, 40%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInfraestrutura)"
            />
            <Area
              type="monotone"
              dataKey="mobilidade"
              name="Mobilidade"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMobilidade)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
