// Define incident types
export interface Incident {
  id: string
  type: string
  highway: string
  location: string
  description: string
  coordinates: {
    lat: number
    lng: number
  }
  state: string
  date: string
  timestamp: string
}

// Brazilian highways by state - Complete mapping for all states
const highwaysByState: { [key: string]: { name: string; nickname: string }[] } = {
  "São Paulo": [
    { name: "BR-116", nickname: "Rodovia Presidente Dutra" },
    { name: "SP-330", nickname: "Rodovia Anhanguera" },
    { name: "SP-348", nickname: "Rodovia dos Bandeirantes" },
    { name: "SP-280", nickname: "Rodovia Castelo Branco" },
  ],
  "Rio de Janeiro": [
    { name: "BR-101", nickname: "Rodovia Rio-Santos" },
    { name: "BR-116", nickname: "Rodovia Presidente Dutra" },
    { name: "RJ-124", nickname: "Via Lagos" },
  ],
  "Minas Gerais": [
    { name: "BR-381", nickname: "Rodovia Fernão Dias" },
    { name: "BR-040", nickname: "Rodovia Washington Luís" },
    { name: "MG-010", nickname: "Linha Verde" },
  ],
  Bahia: [
    { name: "BR-101", nickname: "Rodovia Litorânea" },
    { name: "BR-116", nickname: "Rodovia Santos Dumont" },
    { name: "BR-242", nickname: "Rodovia Centro-Oeste" },
  ],
  Paraná: [
    { name: "BR-277", nickname: "Rodovia do Café" },
    { name: "BR-376", nickname: "Rodovia do Café" },
    { name: "PR-151", nickname: "Rodovia Transbrasiliana" },
  ],
  "Rio Grande do Sul": [
    { name: "BR-116", nickname: "Rodovia Presidente Getúlio Vargas" },
    { name: "BR-290", nickname: "Rodovia Osvaldo Aranha" },
    { name: "RS-122", nickname: "Rodovia da Serra Gaúcha" },
  ],
  Pernambuco: [
    { name: "BR-101", nickname: "Rodovia Governador Mário Covas" },
    { name: "BR-232", nickname: "Rodovia Luiz Gonzaga" },
    { name: "PE-060", nickname: "Rodovia das Praias" },
  ],
  Ceará: [
    { name: "BR-116", nickname: "Rodovia Santos Dumont" },
    { name: "BR-222", nickname: "Rodovia Fortaleza-Teresina" },
    { name: "CE-040", nickname: "Rodovia do Sol Poente" },
  ],
  Pará: [
    { name: "BR-316", nickname: "Rodovia Belém-Brasília" },
    { name: "BR-230", nickname: "Rodovia Transamazônica" },
    { name: "PA-150", nickname: "Rodovia Paulo Fontelles" },
  ],
  "Santa Catarina": [
    { name: "BR-101", nickname: "Rodovia Governador Mário Covas" },
    { name: "BR-282", nickname: "Rodovia Jorge Lacerda" },
    { name: "SC-401", nickname: "Rodovia José Carlos Daux" },
  ],
}

// Brazilian states with their coordinates and traffic patterns
const states = [
  {
    name: "São Paulo",
    center: { lat: -23.5505, lng: -46.6333 },
    radius: 2,
    trafficFactor: 1.5,
  },
  {
    name: "Rio de Janeiro",
    center: { lat: -22.9068, lng: -43.1729 },
    radius: 1.5,
    trafficFactor: 1.3,
  },
  {
    name: "Minas Gerais",
    center: { lat: -19.9167, lng: -43.9345 },
    radius: 2.5,
    trafficFactor: 1.2,
  },
  {
    name: "Bahia",
    center: { lat: -12.9714, lng: -38.5014 },
    radius: 3,
    trafficFactor: 1.1,
  },
  {
    name: "Paraná",
    center: { lat: -25.4195, lng: -49.2646 },
    radius: 2,
    trafficFactor: 1.1,
  },
  {
    name: "Rio Grande do Sul",
    center: { lat: -30.0346, lng: -51.2177 },
    radius: 2.5,
    trafficFactor: 1.1,
  },
  {
    name: "Pernambuco",
    center: { lat: -8.0476, lng: -34.877 },
    radius: 1.5,
    trafficFactor: 1.0,
  },
  {
    name: "Ceará",
    center: { lat: -3.7172, lng: -38.5433 },
    radius: 2,
    trafficFactor: 1.0,
  },
  {
    name: "Pará",
    center: { lat: -1.4558, lng: -48.4902 },
    radius: 3,
    trafficFactor: 0.9,
  },
  {
    name: "Santa Catarina",
    center: { lat: -27.5969, lng: -48.5495 },
    radius: 1.5,
    trafficFactor: 1.0,
  },
]

// Ensure states array only includes states that have highway data
const validStates = states.filter((state) => highwaysByState[state.name])

// Incident descriptions by type and severity
const incidentDescriptions = {
  Acidente: {
    Alto: [
      "Colisão múltipla com interdição total",
      "Acidente grave com vítimas",
      "Engavetamento com mais de 5 veículos",
    ],
    Médio: ["Colisão entre dois veículos", "Acidente com derramamento de carga", "Capotamento sem vítimas graves"],
    Baixo: ["Colisão sem vítimas", "Veículo com pane mecânica", "Incidente sem bloqueio de pista"],
  },
  Bloqueio: {
    Alto: ["Bloqueio total por manifestação", "Interdição completa por deslizamento", "Bloqueio por acidente grave"],
    Médio: [
      "Bloqueio parcial por obras",
      "Interdição de faixas por queda de árvore",
      "Bloqueio temporário para resgate",
    ],
    Baixo: ["Bloqueio de acostamento", "Estreitamento de pista", "Bloqueio móvel para manutenção"],
  },
  Obra: {
    Alto: ["Obras de duplicação da via", "Reconstrução de ponte", "Obras de contenção emergencial"],
    Médio: ["Manutenção do pavimento", "Obras de drenagem", "Instalação de passarela"],
    Baixo: ["Manutenção de sinalização", "Poda de vegetação", "Pintura de faixas"],
  },
}

// Generate incident ID
export function generateIncidentId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Get current hour weight for traffic patterns
function getHourWeight(): number {
  const hour = new Date().getHours()

  // Rush hours (higher probability of incidents)
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return 2.0
  }
  // Late night (lower probability)
  if (hour >= 23 || hour <= 4) {
    return 0.5
  }
  // Normal hours
  return 1.0
}

// Get day weight for traffic patterns
function getDayWeight(): number {
  const day = new Date().getDay()

  // Weekend
  if (day === 0 || day === 6) {
    return 0.7
  }
  // Friday (higher traffic)
  if (day === 5) {
    return 1.3
  }
  // Regular weekday
  return 1.0
}

// Generate random coordinates near a state center
function generateCoordinatesNearState(state: (typeof states)[0]): { lat: number; lng: number } {
  const latOffset = (Math.random() - 0.5) * state.radius * 2
  const lngOffset = (Math.random() - 0.5) * state.radius * 2

  return {
    lat: state.center.lat + latOffset,
    lng: state.center.lng + lngOffset,
  }
}

// Get severity based on time and random factor
function getSeverity(): "Alto" | "Médio" | "Baixo" {
  const random = Math.random()
  const hourWeight = getHourWeight()
  const dayWeight = getDayWeight()
  const totalWeight = random * hourWeight * dayWeight

  if (totalWeight > 1.5) return "Alto"
  if (totalWeight > 0.8) return "Médio"
  return "Baixo"
}

// Generate random incidents
export function generateRandomIncidents(count: number): Incident[] {
  const incidents: Incident[] = []
  const hourWeight = getHourWeight()
  const dayWeight = getDayWeight()

  for (let i = 0; i < count; i++) {
    // Select random state from valid states only
    const stateIndex = Math.floor(Math.random() * validStates.length)
    const state = validStates[stateIndex]

    // Get highways for the state (we know this exists because we filtered for valid states)
    const stateHighways = highwaysByState[state.name]
    const highway = stateHighways[Math.floor(Math.random() * stateHighways.length)]

    // Generate incident type based on weights
    const typeRandom = Math.random() * hourWeight * dayWeight
    let type: string
    if (typeRandom > 1.2) {
      type = "Acidente"
    } else if (typeRandom > 0.7) {
      type = "Bloqueio"
    } else {
      type = "Obra"
    }

    // Get severity and description
    const severity = getSeverity()
    const descriptions = incidentDescriptions[type as keyof typeof incidentDescriptions][severity]
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]

    // Generate coordinates
    const coordinates = generateCoordinatesNearState(state)

    // Create timestamp
    const now = new Date()
    const timestamp = now.toISOString()
    const dateStr = now.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    // Create incident
    incidents.push({
      id: generateIncidentId(),
      type,
      highway: highway.name,
      location: `${state.name} - ${highway.nickname}`,
      description: `[${severity}] ${description}`,
      coordinates,
      state: state.name,
      date: dateStr,
      timestamp,
    })
  }

  return incidents
}

// Get base incident count based on time
export function getBaseIncidentCount(): number {
  const hourWeight = getHourWeight()
  const dayWeight = getDayWeight()

  // Base count between 15-30 incidents
  return Math.floor(15 + Math.random() * 15 * hourWeight * dayWeight)
}

