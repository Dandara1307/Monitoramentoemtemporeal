"use client"

import { useEffect, useRef } from "react"
import type { Incident } from "@/lib/incidents"
import Script from "next/script"

interface IncidentMapProps {
  incidents: Incident[]
}

export default function IncidentMap({ incidents }: IncidentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current || !window.L) return

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView([-14.235, -51.9253], 4)

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)
    }

    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    const createCustomIcon = (type: string) => {
      const getIconSvg = (type: string) => {
        const size = 16
        const color = type === "Acidente" ? "#ef4444" : type === "Bloqueio" ? "#f97316" : "#eab308"

        const icons = {
          Acidente: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="${color}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 1.73-3Z"></path></svg>`,
          Bloqueio: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="${color}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`,
          Obra: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="${color}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"></rect></svg>`,
        }

        return icons[type as keyof typeof icons] || icons.Acidente
      }

      const svg = getIconSvg(type)
      const blob = new Blob([svg], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)

      return window.L.divIcon({
        html: `<img src="${url}" class="w-4 h-4" />`,
        className: "custom-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8],
      })
    }

    incidents.forEach((incident) => {
      const icon = createCustomIcon(incident.type)

      const marker = window.L.marker([incident.coordinates.lat, incident.coordinates.lng], { icon }).addTo(
        mapInstanceRef.current,
      )

      marker.bindPopup(`
  <div class="incident-popup text-white">
    <h3 class="text-lg font-bold mb-2" style="color: ${
      incident.type === "Acidente" ? "#ef4444" : incident.type === "Bloqueio" ? "#f97316" : "#eab308"
    }">${incident.type}</h3>
    <p class="mb-1"><strong>Estado:</strong> ${incident.state}</p>
    <p class="mb-1"><strong>Rodovia:</strong> ${incident.highway}</p>
    <p class="mb-1"><strong>Local:</strong> ${incident.location}</p>
    <p class="mb-1"><strong>Coordenadas:</strong> ${incident.coordinates.lat.toFixed(4)}, ${incident.coordinates.lng.toFixed(4)}</p>
    <p class="mb-1"><strong>Descrição:</strong> ${incident.description}</p>
    <p class="mb-1"><strong>Data:</strong> ${incident.date}</p>
    <p><strong>Atualizado:</strong> ${new Date().toLocaleTimeString()}</p>
  </div>
`)

      markersRef.current.push(marker)
    })

    return () => {
      markersRef.current.forEach((marker) => {
        if (marker._icon) {
          const img = marker._icon.querySelector("img")
          if (img) {
            URL.revokeObjectURL(img.src)
          }
        }
      })
    }
  }, [incidents])

  return (
    <>
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        onLoad={() => {
          if (mapRef.current && !mapInstanceRef.current) {
            mapInstanceRef.current = window.L.map(mapRef.current).setView([-14.235, -51.9253], 4)
            window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap contributors",
              maxZoom: 19,
            }).addTo(mapInstanceRef.current)
          }
        }}
      />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full min-h-[500px]" />
    </>
  )
}

declare global {
  interface Window {
    L: any
  }
}

