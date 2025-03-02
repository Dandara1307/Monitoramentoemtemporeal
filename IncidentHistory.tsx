import type { Incident } from "@/lib/incidents"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, Construction } from "lucide-react"

interface IncidentHistoryProps {
  incidents: Incident[]
}

export default function IncidentHistory({ incidents }: IncidentHistoryProps) {
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "Acidente":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "Bloqueio":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "Obra":
        return <Construction className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getSeverityClass = (description: string) => {
    if (description.includes("[Alto]")) return "text-red-500"
    if (description.includes("[Médio]")) return "text-orange-500"
    return "text-yellow-500"
  }

  return (
    <Card className="w-80 bg-zinc-900 border-zinc-800">
      <CardHeader className="bg-zinc-900 border-b border-zinc-800">
        <CardTitle className="text-lg font-semibold text-white">Histórico de Ocorrências</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <CardContent className="p-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="mb-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 last:mb-0">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getIncidentIcon(incident.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{incident.state}</p>
                    <time className="text-xs text-zinc-400">
                      {new Date(incident.timestamp).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <p className="text-xs text-white/90">
                    {incident.highway} - {incident.location}
                  </p>
                  <p className={`text-xs ${getSeverityClass(incident.description)}`}>{incident.description}</p>
                  <p className="text-xs text-white/80">
                    {incident.coordinates.lat.toFixed(4)}, {incident.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  )
}

