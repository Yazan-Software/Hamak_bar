'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import type { Service, ServiceCategory } from '@/types'

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: 'haircut', label: 'Knipbeurt' },
  { value: 'beard', label: 'Baard' },
  { value: 'color', label: 'Kleur' },
  { value: 'treatment', label: 'Behandeling' },
  { value: 'kids', label: 'Kinderen' },
]

const emptyService = {
  name: '',
  description: '',
  duration_minutes: 30,
  price: 0,
  deposit_amount: 0,
  category: 'haircut' as ServiceCategory,
  is_active: true,
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState(emptyService)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('category')
    setServices(data ?? [])
    setLoading(false)
  }

  useEffect(() => { void fetchServices() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyService)
    setDialogOpen(true)
  }

  const openEdit = (service: Service) => {
    setEditing(service)
    setForm({
      name: service.name,
      description: service.description ?? '',
      duration_minutes: service.duration_minutes,
      price: service.price,
      deposit_amount: service.deposit_amount,
      category: service.category,
      is_active: service.is_active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editing) {
      const { error } = await supabase
        .from('services')
        .update(form)
        .eq('id', editing.id)
      if (error) { toast.error('Opslaan mislukt'); setSaving(false); return }
      toast.success('Service bijgewerkt')
    } else {
      const { error } = await supabase.from('services').insert(form)
      if (error) { toast.error('Aanmaken mislukt'); setSaving(false); return }
      toast.success('Service aangemaakt')
    }
    setSaving(false)
    setDialogOpen(false)
    void fetchServices()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze service wilt verwijderen?')) return
    await supabase.from('services').delete().eq('id', id)
    toast.success('Service verwijderd')
    void fetchServices()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-playfair text-3xl font-bold text-[#FAFAFA]">Services</h1>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nieuwe Service
        </Button>
      </div>

      <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A] text-[#A0A0A0]">
              {['Naam', 'Categorie', 'Duur', 'Prijs', 'Status', 'Acties'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#A0A0A0]">Laden...</td></tr>
            ) : services.map((service) => (
              <tr key={service.id} className="border-b border-[#2A2A2A] last:border-0 hover:bg-[#1A1A1A]">
                <td className="px-4 py-3 text-[#FAFAFA] font-medium">{service.name}</td>
                <td className="px-4 py-3">
                  <Badge variant="gold">{CATEGORIES.find((c) => c.value === service.category)?.label}</Badge>
                </td>
                <td className="px-4 py-3 text-[#A0A0A0]">{service.duration_minutes} min</td>
                <td className="px-4 py-3 text-[#C9A96E]">{formatPrice(service.price)}</td>
                <td className="px-4 py-3">
                  <Badge variant={service.is_active ? 'default' : 'outline'}>
                    {service.is_active ? 'Actief' : 'Inactief'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(service)}
                      className="p-1.5 rounded text-[#A0A0A0] hover:text-[#C9A96E] hover:bg-[#C9A96E]/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => void handleDelete(service.id)}
                      className="p-1.5 rounded text-[#A0A0A0] hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Service Bewerken' : 'Nieuwe Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Naam</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Beschrijving</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="mt-1 flex w-full rounded-md border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm text-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Duur (min)</Label>
                <Input
                  type="number"
                  value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Prijs (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Aanbetaling (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.deposit_amount}
                  onChange={(e) => setForm({ ...form, deposit_amount: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Categorie</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as ServiceCategory })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Annuleren</Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
