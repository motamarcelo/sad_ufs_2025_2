import { useState } from "react";
import { MapContainer, TileLayer, Polygon, CircleMarker, Polyline, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, Building, AlertTriangle, MapPin, Route, HelpCircle, X, Map } from "lucide-react";
import { cn } from "@/lib/utils";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const layers = [
  {
    id: "uso-solo",
    label: "Uso do Solo",
    color: "bg-primary",
    icon: Building,
    description: "Classificação dos bairros por tipo de ocupação: residencial, comercial, industrial, turístico ou misto.",
  },
  {
    id: "zonas-risco",
    label: "Zonas de Risco",
    color: "bg-destructive",
    icon: AlertTriangle,
    description: "Áreas com vulnerabilidade a alagamentos, deslizamentos ou degradação ambiental que requerem monitoramento.",
  },
  {
    id: "infraestrutura",
    label: "Infraestrutura",
    color: "bg-accent",
    icon: MapPin,
    description: "Equipamentos públicos essenciais: hospitais, escolas, terminais de transporte e centros comerciais.",
  },
  {
    id: "mobilidade",
    label: "Mobilidade",
    color: "bg-warning",
    icon: Route,
    description: "Principais vias e corredores de transporte que conectam os bairros da cidade.",
  },
];

// Polígonos reais dos bairros de Aracaju (fonte: OpenStreetMap/Nominatim)
// Coordenadas simplificadas para performance, mantendo a forma real
const bairros: { name: string; type: string; color: string; coords: [number, number][] }[] = [
  {
    name: "Centro",
    type: "Comercial/Histórico",
    color: "#1e3a5f",
    coords: [
      [-10.9063, -37.0575], [-10.9064, -37.0575], [-10.9127, -37.0574],
      [-10.9172, -37.0574], [-10.9185, -37.0574], [-10.9185, -37.0418],
      [-10.9039, -37.0434], [-10.9063, -37.0575],
    ],
  },
  {
    name: "Jardins",
    type: "Residencial Alto Padrão",
    color: "#2563eb",
    coords: [
      [-10.9339, -37.0542], [-10.9355, -37.0504], [-10.9357, -37.0480],
      [-10.9370, -37.0484], [-10.9405, -37.0493], [-10.9414, -37.0496],
      [-10.9420, -37.0499], [-10.9423, -37.0501], [-10.9428, -37.0506],
      [-10.9436, -37.0545], [-10.9441, -37.0554], [-10.9460, -37.0576],
      [-10.9510, -37.0590], [-10.9527, -37.0573], [-10.9530, -37.0569],
      [-10.9555, -37.0511], [-10.9560, -37.0499], [-10.9549, -37.0537],
      [-10.9527, -37.0578], [-10.9510, -37.0591], [-10.9460, -37.0578],
      [-10.9442, -37.0558], [-10.9438, -37.0549], [-10.9432, -37.0543],
      [-10.9402, -37.0583], [-10.9392, -37.0596], [-10.9389, -37.0606],
      [-10.9376, -37.0632], [-10.9365, -37.0645], [-10.9353, -37.0656],
      [-10.9347, -37.0661], [-10.9339, -37.0668], [-10.9339, -37.0542],
    ],
  },
  {
    name: "Atalaia",
    type: "Turístico/Lazer",
    color: "#0ea5e9",
    coords: [
      [-10.9964, -37.0658], [-10.9976, -37.0649], [-10.9990, -37.0634],
      [-11.0003, -37.0617], [-11.0014, -37.0597], [-11.0026, -37.0550],
      [-10.9817, -37.0367], [-10.9760, -37.0531], [-10.9816, -37.0570],
      [-10.9870, -37.0600], [-10.9920, -37.0635], [-10.9964, -37.0658],
    ],
  },
  {
    name: "Siqueira Campos",
    type: "Residencial/Comercial",
    color: "#3b82f6",
    coords: [
      [-10.9277, -37.0779], [-10.9278, -37.0757], [-10.9279, -37.0745],
      [-10.9275, -37.0740], [-10.9268, -37.0732], [-10.9265, -37.0729],
      [-10.9249, -37.0717], [-10.9230, -37.0710], [-10.9189, -37.0695],
      [-10.9187, -37.0694], [-10.9162, -37.0685], [-10.9137, -37.0677],
      [-10.9126, -37.0673], [-10.9116, -37.0671], [-10.9105, -37.0667],
      [-10.9067, -37.0654], [-10.9058, -37.0670], [-10.9055, -37.0693],
      [-10.9052, -37.0705], [-10.9050, -37.0725], [-10.9049, -37.0736],
      [-10.9054, -37.0737], [-10.9066, -37.0738], [-10.9077, -37.0738],
      [-10.9087, -37.0741], [-10.9094, -37.0745], [-10.9101, -37.0752],
      [-10.9110, -37.0758], [-10.9122, -37.0760], [-10.9134, -37.0760],
      [-10.9150, -37.0760], [-10.9164, -37.0744], [-10.9174, -37.0745],
      [-10.9183, -37.0746], [-10.9185, -37.0747], [-10.9196, -37.0749],
      [-10.9206, -37.0750], [-10.9219, -37.0758], [-10.9235, -37.0761],
      [-10.9243, -37.0765], [-10.9248, -37.0769], [-10.9253, -37.0772],
      [-10.9262, -37.0773], [-10.9268, -37.0776], [-10.9272, -37.0778],
      [-10.9277, -37.0779],
    ],
  },
  {
    name: "Coroa do Meio",
    type: "Residencial Médio",
    color: "#6366f1",
    coords: [
      [-10.9357, -37.0480], [-10.9370, -37.0484], [-10.9400, -37.0493],
      [-10.9414, -37.0496], [-10.9460, -37.0510], [-10.9500, -37.0449],
      [-10.9530, -37.0400], [-10.9560, -37.0370], [-10.9600, -37.0335],
      [-10.9650, -37.0380], [-10.9700, -37.0430], [-10.9760, -37.0531],
      [-10.9700, -37.0560], [-10.9650, -37.0550], [-10.9600, -37.0540],
      [-10.9550, -37.0530], [-10.9510, -37.0520], [-10.9460, -37.0510],
      [-10.9400, -37.0493], [-10.9357, -37.0480],
    ],
  },
  {
    name: "Farolândia",
    type: "Residencial",
    color: "#4f46e5",
    coords: [
      [-10.9728, -37.0802], [-10.9742, -37.0775], [-10.9752, -37.0754],
      [-10.9767, -37.0725], [-10.9767, -37.0725], [-10.9750, -37.0700],
      [-10.9720, -37.0670], [-10.9690, -37.0650], [-10.9660, -37.0630],
      [-10.9620, -37.0600], [-10.9580, -37.0570], [-10.9533, -37.0513],
      [-10.9560, -37.0530], [-10.9600, -37.0560], [-10.9640, -37.0590],
      [-10.9680, -37.0620], [-10.9720, -37.0660], [-10.9750, -37.0700],
      [-10.9770, -37.0730], [-10.9838, -37.0770], [-10.9800, -37.0790],
      [-10.9728, -37.0802],
    ],
  },
  {
    name: "Luzia",
    type: "Residencial",
    color: "#7c3aed",
    coords: [
      [-10.9428, -37.0775], [-10.9430, -37.0774], [-10.9433, -37.0770],
      [-10.9441, -37.0763], [-10.9448, -37.0756], [-10.9460, -37.0744],
      [-10.9456, -37.0740], [-10.9450, -37.0733], [-10.9442, -37.0724],
      [-10.9435, -37.0717], [-10.9435, -37.0717], [-10.9437, -37.0711],
      [-10.9443, -37.0695], [-10.9442, -37.0693], [-10.9430, -37.0679],
      [-10.9421, -37.0669], [-10.9415, -37.0663], [-10.9411, -37.0658],
      [-10.9410, -37.0657], [-10.9402, -37.0647], [-10.9399, -37.0643],
      [-10.9396, -37.0641], [-10.9391, -37.0637], [-10.9385, -37.0634],
      [-10.9385, -37.0634], [-10.9377, -37.0631], [-10.9374, -37.0631],
      [-10.9371, -37.0630], [-10.9371, -37.0630], [-10.9369, -37.0629],
      [-10.9358, -37.0628], [-10.9356, -37.0628], [-10.9351, -37.0628],
      [-10.9349, -37.0627], [-10.9344, -37.0625], [-10.9341, -37.0623],
      [-10.9340, -37.0622], [-10.9338, -37.0621], [-10.9332, -37.0619],
      [-10.9327, -37.0617], [-10.9324, -37.0616], [-10.9317, -37.0614],
      [-10.9308, -37.0611], [-10.9305, -37.0609], [-10.9301, -37.0619],
      [-10.9296, -37.0630], [-10.9291, -37.0652], [-10.9287, -37.0667],
      [-10.9278, -37.0694], [-10.9280, -37.0695], [-10.9311, -37.0702],
      [-10.9322, -37.0702], [-10.9338, -37.0702], [-10.9349, -37.0703],
      [-10.9365, -37.0692], [-10.9372, -37.0689], [-10.9376, -37.0687],
      [-10.9378, -37.0687], [-10.9379, -37.0687], [-10.9380, -37.0688],
      [-10.9381, -37.0689], [-10.9381, -37.0691], [-10.9385, -37.0703],
      [-10.9388, -37.0711], [-10.9390, -37.0715], [-10.9391, -37.0720],
      [-10.9391, -37.0722], [-10.9391, -37.0723], [-10.9388, -37.0728],
      [-10.9387, -37.0734], [-10.9388, -37.0741], [-10.9389, -37.0750],
      [-10.9389, -37.0751], [-10.9391, -37.0753], [-10.9392, -37.0755],
      [-10.9401, -37.0759], [-10.9420, -37.0768], [-10.9424, -37.0770],
      [-10.9425, -37.0772], [-10.9426, -37.0774], [-10.9428, -37.0775],
    ],
  },
];

// Zonas de risco - coordenadas reais dos bairros (Nominatim/OSM)
const zonasRisco = [
  { name: "Bugio", level: "Alto", description: "Inundação - margens do Rio do Sal", lat: -10.8909, lng: -37.0961 },
  { name: "Jabotiana", level: "Crítico", description: "Inundação - margens do Rio Poxim", lat: -10.9438, lng: -37.0858 },
  { name: "Santa Maria", level: "Alto", description: "Deslizamento de terra e alagamentos", lat: -10.9920, lng: -37.1032 },
  { name: "Porto Dantas", level: "Alto", description: "Inundação - área de manguezal", lat: -10.8732, lng: -37.0563 },
  { name: "Soledade", level: "Médio", description: "Inundação - sub-bacia do Rio do Sal", lat: -10.8850, lng: -37.0880 },
  { name: "Coroa do Meio (mangue)", level: "Ambiental", description: "Área de preservação - manguezal do Poxim", lat: -10.9450, lng: -37.0420 },
];

// Infraestrutura - coordenadas reais (Nominatim/OSM e Google Maps)
const infraestrutura = [
  { name: "HUSE - Hospital de Urgência de Sergipe", type: "Hospital", lat: -10.9144, lng: -37.0903 },
  { name: "UFS - Universidade Federal de Sergipe", type: "Universidade", lat: -10.9271, lng: -37.1019 },
  { name: "Shopping Jardins", type: "Comércio", lat: -10.9430, lng: -37.0595 },
  { name: "Aeroporto de Aracaju", type: "Aeroporto", lat: -10.9853, lng: -37.0733 },
  { name: "Terminal Rodoviário Gov. José R. Leite", type: "Transporte", lat: -10.9140, lng: -37.0480 },
  { name: "Mercado Municipal Thales Ferraz", type: "Comércio", lat: -10.9115, lng: -37.0518 },
];

// Vias principais - traçado aproximado seguindo a geometria real
const vias: { name: string; color: string; weight: number; coords: [number, number][] }[] = [
  {
    name: "Av. Beira Mar",
    color: "#f59e0b",
    weight: 4,
    coords: [
      [-10.9110, -37.0530], [-10.9140, -37.0520], [-10.9180, -37.0510],
      [-10.9220, -37.0500], [-10.9260, -37.0490], [-10.9300, -37.0480],
      [-10.9340, -37.0470], [-10.9380, -37.0460], [-10.9420, -37.0455],
      [-10.9460, -37.0460], [-10.9500, -37.0465],
    ],
  },
  {
    name: "Av. Augusto Franco (Deus é Fiel)",
    color: "#f97316",
    weight: 4,
    coords: [
      [-10.9200, -37.0680], [-10.9230, -37.0670], [-10.9260, -37.0660],
      [-10.9290, -37.0650], [-10.9320, -37.0640], [-10.9350, -37.0635],
      [-10.9380, -37.0630], [-10.9410, -37.0628], [-10.9440, -37.0630],
      [-10.9470, -37.0640],
    ],
  },
  {
    name: "Av. Tancredo Neves",
    color: "#eab308",
    weight: 4,
    coords: [
      [-10.9090, -37.0750], [-10.9120, -37.0780], [-10.9160, -37.0810],
      [-10.9200, -37.0830], [-10.9250, -37.0840], [-10.9300, -37.0845],
      [-10.9350, -37.0845], [-10.9400, -37.0840], [-10.9450, -37.0830],
    ],
  },
  {
    name: "Av. Hermes Fontes",
    color: "#a855f7",
    weight: 3,
    coords: [
      [-10.9150, -37.0660], [-10.9190, -37.0665], [-10.9230, -37.0670],
      [-10.9270, -37.0678], [-10.9310, -37.0690], [-10.9350, -37.0700],
      [-10.9390, -37.0715],
    ],
  },
  {
    name: "Rod. dos Náufragos",
    color: "#06b6d4",
    weight: 3,
    coords: [
      [-10.9500, -37.0590], [-10.9550, -37.0600], [-10.9600, -37.0620],
      [-10.9650, -37.0650], [-10.9700, -37.0680], [-10.9750, -37.0710],
      [-10.9800, -37.0740],
    ],
  },
];

function getRiskColor(level: string) {
  switch (level) {
    case "Crítico": return "#ef4444";
    case "Alto": return "#f97316";
    case "Médio": return "#eab308";
    case "Ambiental": return "#22c55e";
    default: return "#9ca3af";
  }
}

function createInfraIcon(type: string) {
  const config: Record<string, { color: string; svg: string }> = {
    Hospital: {
      color: "#ef4444",
      svg: '<path d="M18 18V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12"/><path d="M2 18h20"/><path d="M12 8v4"/><path d="M10 10h4"/>',
    },
    Universidade: {
      color: "#3b82f6",
      svg: '<path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 5v17"/>',
    },
    Comércio: {
      color: "#8b5cf6",
      svg: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
    },
    Aeroporto: {
      color: "#0891b2",
      svg: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    },
    Transporte: {
      color: "#f59e0b",
      svg: '<path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    },
  };

  const c = config[type] || { color: "#22c55e", svg: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>' };

  return L.divIcon({
    className: "",
    html: `<div style="background:${c.color};width:30px;height:30px;border-radius:50%;border:2.5px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.35);">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${c.svg}</svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

const ARACAJU_CENTER: [number, number] = [-10.9280, -37.0640];

export function MapPlaceholder() {
  const [activeLayers, setActiveLayers] = useState<string[]>(["uso-solo", "zonas-risco"]);
  const [showLayers, setShowLayers] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const showLandUse = activeLayers.includes("uso-solo");
  const showRisk = activeLayers.includes("zonas-risco");
  const showInfra = activeLayers.includes("infraestrutura");
  const showMobility = activeLayers.includes("mobilidade");

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={ARACAJU_CENTER}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Uso do Solo - Polígonos reais dos bairros */}
        {showLandUse &&
          bairros.map((bairro) => (
            <Polygon
              key={bairro.name}
              positions={bairro.coords}
              pathOptions={{
                color: bairro.color,
                fillColor: bairro.color,
                fillOpacity: 0.20,
                weight: 2,
              }}
            >
              <Tooltip direction="center" permanent className="bairro-label">
                {bairro.name}
              </Tooltip>
              <Popup>
                <strong>{bairro.name}</strong>
                <br />
                <span style={{ color: "#666" }}>{bairro.type}</span>
              </Popup>
            </Polygon>
          ))}

        {/* Zonas de Risco */}
        {showRisk &&
          zonasRisco.map((zona) => (
            <CircleMarker
              key={zona.name}
              center={[zona.lat, zona.lng]}
              radius={16}
              pathOptions={{
                color: getRiskColor(zona.level),
                fillColor: getRiskColor(zona.level),
                fillOpacity: 0.35,
                weight: 3,
              }}
            >
              <Tooltip direction="top">
                {zona.name} — {zona.level}
              </Tooltip>
              <Popup>
                <strong>{zona.name}</strong>
                <br />
                <span style={{ color: getRiskColor(zona.level), fontWeight: 600 }}>Risco: {zona.level}</span>
                <br />
                <span style={{ color: "#666", fontSize: "12px" }}>{zona.description}</span>
              </Popup>
            </CircleMarker>
          ))}

        {/* Infraestrutura */}
        {showInfra &&
          infraestrutura.map((ponto) => (
            <Marker
              key={ponto.name}
              position={[ponto.lat, ponto.lng]}
              icon={createInfraIcon(ponto.type)}
            >
              <Tooltip direction="top">{ponto.name}</Tooltip>
              <Popup>
                <strong>{ponto.name}</strong>
                <br />
                <span style={{ color: "#666" }}>{ponto.type}</span>
              </Popup>
            </Marker>
          ))}

        {/* Mobilidade - Vias */}
        {showMobility &&
          vias.map((via) => (
            <Polyline
              key={via.name}
              positions={via.coords}
              pathOptions={{
                color: via.color,
                weight: via.weight,
                opacity: 0.85,
                dashArray: "10 6",
              }}
            >
              <Tooltip sticky>{via.name}</Tooltip>
              <Popup>{via.name}</Popup>
            </Polyline>
          ))}
      </MapContainer>

      {/* Location Label */}
      <div className="absolute top-4 left-14 bg-card px-4 py-2 rounded-lg shadow-lg border border-border z-[1000]">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Aracaju, SE</p>
            <p className="text-xs text-muted-foreground">Protótipo — Dados ilustrativos</p>
          </div>
        </div>
      </div>

      {/* Help Button */}
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={() => setShowHelp(true)}
          className="p-2.5 bg-card rounded-lg shadow-lg border border-border hover:bg-secondary transition-colors"
          title="Ajuda"
        >
          <HelpCircle className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
          <div className="bg-card rounded-xl shadow-2xl border border-border max-w-md w-full max-h-[80%] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Entendendo o Mapa</h3>
              <button onClick={() => setShowHelp(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Este mapa interativo permite visualizar diferentes aspectos do planejamento urbano de Aracaju.
                Use o botão <strong>"Camadas"</strong> para ativar/desativar cada visualização.
              </p>
              <div className="space-y-3">
                {layers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <div key={layer.id} className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", layer.color)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{layer.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{layer.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Dica:</strong> Clique em qualquer elemento do mapa para ver mais detalhes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layers Control */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="relative">
          <button
            onClick={() => setShowLayers(!showLayers)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg border border-border transition-colors font-medium",
              showLayers ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary text-foreground"
            )}
          >
            <Layers className="w-5 h-5" />
            <span className="text-sm">Camadas</span>
          </button>

          {showLayers && (
            <div className="absolute bottom-full left-0 mb-2 bg-card rounded-lg shadow-xl border border-border p-4 min-w-56 z-[1000]">
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Camadas do Mapa
              </p>
              <div className="space-y-3">
                {layers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <label key={layer.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={activeLayers.includes(layer.id)}
                        onChange={() => toggleLayer(layer.id)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          activeLayers.includes(layer.id)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/40 group-hover:border-primary/60"
                        )}
                      >
                        {activeLayers.includes(layer.id) && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-6 h-6 rounded flex items-center justify-center", layer.color)}>
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm text-foreground">{layer.label}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Layers Legend */}
      <div className="absolute bottom-4 right-4 bg-card px-3 py-2.5 rounded-lg shadow-lg border border-border z-[1000]">
        <p className="text-xs text-muted-foreground mb-1.5 font-medium">Camadas ativas</p>
        <div className="flex flex-wrap gap-2">
          {activeLayers.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">Nenhuma</span>
          ) : (
            activeLayers.map((layerId) => {
              const layer = layers.find((l) => l.id === layerId);
              if (!layer) return null;
              const Icon = layer.icon;
              return (
                <div key={layerId} className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded">
                  <div className={cn("w-4 h-4 rounded flex items-center justify-center", layer.color)}>
                    <Icon className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-xs text-foreground font-medium">{layer.label.split(" ")[0]}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
