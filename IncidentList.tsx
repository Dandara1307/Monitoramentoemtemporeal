import type { Incident } from "@/lib/incidents"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, AlertCircle, Construction } from "lucide-react"

interface IncidentListProps {
  incidents: Incident[]
}

export default function IncidentList({ incidents }: IncidentListProps) {
  // Sort incidents by date (newest first)
  const sortedIncidents = [...incidents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

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
    <div className="overflow-auto h-full">
      <Table>
        <TableHeader className="bg-zinc-800 sticky top-0">
          <TableRow>
            <TableHead className="w-[80px]">Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Rodovia</TableHead>
            <TableHead className="hidden md:table-cell">Descrição</TableHead>
            <TableHead className="w-[100px]">Horário</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedIncidents.map((incident) => (
            <TableRow key={incident.id} className="hover:bg-zinc-800">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getIncidentIcon(incident.type)}
                  <span className="hidden sm:inline">{incident.type}</span>
                </div>
              </TableCell>
              <TableCell>{incident.state}</TableCell>
              <TableCell>{incident.highway}</TableCell>
              <TableCell
                className={`hidden md:table-cell truncate max-w-[200px] ${getSeverityClass(incident.description)}`}
              >
                {incident.description}
              </TableCell>
              <TableCell className="text-xs whitespace-nowrap">
                {new Date(incident.timestamp).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

