"use client"

import { useEffect, useState } from "react"
import Header from "@/components/Header"
import IncidentMap from "@/components/IncidentMap"
import IncidentHistory from "@/components/IncidentHistory"
import { type Incident, generateRandomIncidents, getBaseIncidentCount } from "@/lib/incidents"
import { Button } from "@/components/ui/button"
import { exportToExcel } from "@/lib/export"
import Footer from "@/components/Footer"

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Initial incidents
    const initialIncidents = generateRandomIncidents(getBaseIncidentCount())
    setIncidents(initialIncidents)
    setLoading(false)

    // Update incidents every 5 seconds
    const interval = setInterval(() => {
      const baseCount = getBaseIncidentCount()

      setIncidents((prev) => {
        // Keep incidents from last 30 minutes
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
        const filtered = prev.filter((incident) => new Date(incident.timestamp) > thirtyMinutesAgo)

        // Generate new incidents
        const newIncidents = generateRandomIncidents(Math.max(1, Math.floor(Math.random() * 3)))

        // Combine and sort by timestamp
        const combined = [...newIncidents, ...filtered]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, Math.max(baseCount, 50)) // Keep at least baseCount incidents

        return combined
      })

      setLastUpdate(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-white text-xl">Carregando dados...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-400">
            Última atualização: {lastUpdate.toLocaleTimeString()}
            <span className="ml-4">Total: {incidents.length} ocorrências ativas</span>
          </div>
          <Button onClick={() => exportToExcel(incidents)} className="bg-red-700 hover:bg-red-800 text-white">
            Exportar para Excel
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-zinc-900 rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
            <IncidentMap incidents={incidents} />
          </div>
          <IncidentHistory incidents={incidents} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

