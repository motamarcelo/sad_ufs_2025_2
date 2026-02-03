
# Plano: Mapa Interativo Real com Leaflet

## Objetivo
Substituir o placeholder atual por um mapa real e interativo de Aracaju usando a biblioteca Leaflet com tiles do OpenStreetMap (gratuito, sem API key).

## O que vai mudar

### Antes (Atual)
- Formas geométricas simples (quadrados, círculos com blur)
- Não parece um mapa real
- Camadas apenas visuais sem funcionalidade real

### Depois (Novo)
- Mapa real de Aracaju com ruas, bairros e pontos de referência
- Zoom e navegação funcionais (arrastar, zoom com scroll)
- Camadas com marcadores e polígonos reais em localizações de Aracaju
- Controles de zoom e localização funcionais

## Funcionalidades do Novo Mapa

1. **Mapa base real** - Tiles do OpenStreetMap mostrando Aracaju
2. **Zoom e navegação** - Arrastar para mover, scroll para zoom
3. **Camadas interativas**:
   - **Uso do Solo**: Polígonos coloridos em bairros reais (Centro, Jardins, Atalaia, etc.)
   - **Zonas de Risco**: Marcadores de alerta em áreas de alagamento conhecidas
   - **Infraestrutura**: Marcadores de hospitais, escolas, etc.
   - **Mobilidade**: Linhas de vias principais
4. **Controles**: Botões de zoom e centralização funcionais
5. **Legenda**: Indicador de camadas ativas

---

## Detalhes Tecnicos

### Arquivos Modificados

| Arquivo | Alteracao |
|---------|-----------|
| `package.json` | Adicionar dependencias `leaflet` e `react-leaflet` |
| `src/index.css` | Importar CSS do Leaflet |
| `src/components/dashboard/MapPlaceholder.tsx` | Reescrever completamente com mapa real |

### Dependencias Novas
```text
leaflet: ^1.9.4
react-leaflet: ^4.2.1
@types/leaflet: ^1.9.8 (devDependency)
```

### Estrutura do Componente

```text
MapPlaceholder.tsx
├── MapContainer (container do Leaflet)
│   ├── TileLayer (OpenStreetMap tiles)
│   ├── Polygon[] (camada Uso do Solo)
│   ├── CircleMarker[] (camada Zonas de Risco)
│   ├── Marker[] (camada Infraestrutura)
│   └── Polyline[] (camada Mobilidade)
├── Controles personalizados (zoom, layers)
└── Legenda de camadas
```

### Dados de Exemplo (Coordenadas Reais de Aracaju)
- Centro: [-10.9472, -37.0731]
- Bairros: Jardins, Atalaia, Centro, Siqueira Campos
- Zonas de risco: Areas proximas ao Rio Sergipe

### Ordem de Implementacao
1. Instalar dependencias (leaflet, react-leaflet, @types/leaflet)
2. Importar CSS do Leaflet no index.css
3. Criar novo componente de mapa com:
   - MapContainer centralizado em Aracaju
   - TileLayer do OpenStreetMap
   - Dados GeoJSON para cada camada
   - Controles de camadas funcionais
   - Popup com informacoes ao clicar nos elementos
