import type { Incident } from "./incidents"
import * as XLSX from "xlsx"

export function exportToExcel(incidents: Incident[]) {
  // Format data for Excel
  const data = incidents.map((incident) => ({
    Tipo: incident.type,
    Rodovia: incident.highway,
    Local: incident.location,
    Descrição: incident.description,
    Data: incident.date,
    Latitude: incident.coordinates.lat,
    Longitude: incident.coordinates.lng,
  }))

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ocorrências")

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

  // Create Blob and download
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `Ocorrencias_Rodovias_${new Date().toISOString().split("T")[0]}.xlsx`
  link.click()

  // Clean up
  URL.revokeObjectURL(url)
}

