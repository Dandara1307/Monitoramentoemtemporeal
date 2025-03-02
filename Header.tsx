import { AlertTriangle } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-red-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={24} />
          <h1 className="text-2xl font-bold">Monitoramento de Rodovias</h1>
        </div>
        <div className="text-sm">Atualizações em tempo real</div>
      </div>
    </header>
  )
}

