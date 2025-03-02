"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type Incident, generateIncidentId } from "@/lib/incidents"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  type: z.string().min(1, { message: "Selecione o tipo de ocorrência" }),
  highway: z.string().min(1, { message: "Informe a rodovia" }),
  location: z.string().min(3, { message: "Informe o local/km" }),
  description: z.string().min(5, { message: "Forneça uma descrição" }),
  lat: z
    .string()
    .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= -33 && Number.parseFloat(val) <= 5, {
      message: "Latitude inválida (deve estar entre -33 e 5)",
    }),
  lng: z
    .string()
    .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= -74 && Number.parseFloat(val) <= -34, {
      message: "Longitude inválida (deve estar entre -74 e -34)",
    }),
})

interface IncidentFormProps {
  onAddIncident: (incident: Incident) => void
}

export default function IncidentForm({ onAddIncident }: IncidentFormProps) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      highway: "",
      location: "",
      description: "",
      lat: "-15.7801",
      lng: "-47.9292",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)

    // Create new incident
    const now = new Date()
    const newIncident: Incident = {
      id: generateIncidentId(),
      type: values.type,
      highway: values.highway,
      location: values.location,
      description: values.description,
      coordinates: {
        lat: Number.parseFloat(values.lat),
        lng: Number.parseFloat(values.lng),
      },
      date: now.toLocaleDateString("pt-BR"),
      timestamp: now.toISOString(),
    }

    // Simulate API call
    setTimeout(() => {
      onAddIncident(newIncident)
      toast({
        title: "Ocorrência reportada",
        description: "A ocorrência foi adicionada com sucesso.",
      })
      form.reset()
      setSubmitting(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader className="bg-zinc-900">
        <CardTitle className="text-red-500">Reportar Nova Ocorrência</CardTitle>
        <CardDescription>Informe os detalhes da ocorrência na rodovia</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Ocorrência</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={submitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Acidente">Acidente</SelectItem>
                        <SelectItem value="Bloqueio">Bloqueio</SelectItem>
                        <SelectItem value="Obra">Obra</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="highway"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rodovia</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: BR-101" {...field} disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local / KM</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: KM 42 - Próximo a São Paulo" {...field} disabled={submitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a ocorrência em detalhes"
                      className="resize-none"
                      {...field}
                      disabled={submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-red-700 hover:bg-red-800" disabled={submitting}>
              {submitting ? "Enviando..." : "Reportar Ocorrência"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

