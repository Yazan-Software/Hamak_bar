'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Stylist, AvailabilityRule } from '@/types'

const DAYS = [
  { value: 1, label: 'Maandag' },
  { value: 2, label: 'Dinsdag' },
  { value: 3, label: 'Woensdag' },
  { value: 4, label: 'Donderdag' },
  { value: 5, label: 'Vrijdag' },
  { value: 6, label: 'Zaterdag' },
  { value: 0, label: 'Zondag' },
]

export default function AdminAvailabilityPage() {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [selectedStylist, setSelectedStylist] = useState<string>('')
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStylists = async () => {
      const { data } = await supabase.from('stylists').select('*').eq('is_active', true)
      setStylists(data ?? [])
      if (data && data.length > 0 && !selectedStylist) {
        setSelectedStylist(data[0].id)
      }
      setLoading(false)
    }
    void fetchStylists()
  }, [])

  useEffect(() => {
    if (!selectedStylist) return
    const fetchRules = async () => {
      const { data } = await supabase
        .from('availability_rules')
        .select('*')
        .eq('stylist_id', selectedStylist)
        .order('day_of_week')
      setRules(data ?? [])
    }
    void fetchRules()
  }, [selectedStylist])

  const addRule = async () => {
    if (!selectedStylist) return
    const { error } = await supabase.from('availability_rules').insert({
      stylist_id: selectedStylist,
      day_of_week: 1,
      start_time: '09:00',
      end_time: '18:00',
      buffer_minutes: 10,
    })
    if (error) { toast.error('Aanmaken mislukt'); return }
    toast.success('Regel toegevoegd')
    const { data } = await supabase.from('availability_rules').select('*').eq('stylist_id', selectedStylist).order('day_of_week')
    setRules(data ?? [])
  }

  const updateRule = (id: string, field: string, value: string | number) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r))
  }

  const saveRule = async (rule: AvailabilityRule) => {
    const { error } = await supabase.from('availability_rules').update({
      day_of_week: rule.day_of_week,
      start_time: rule.start_time,
      end_time: rule.end_time,
      buffer_minutes: rule.buffer_minutes,
    }).eq('id', rule.id)
    if (error) { toast.error('Opslaan mislukt'); return }
    toast.success('Opgeslagen')
  }

  const deleteRule = async (id: string) => {
    await supabase.from('availability_rules').delete().eq('id', id)
    setRules((prev) => prev.filter((r) => r.id !== id))
    toast.success('Regel verwijderd')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-playfair text-3xl font-bold text-[#FAFAFA]">Beschikbaarheid</h1>
        <Button onClick={() => void addRule()} className="gap-2">
          <Plus className="h-4 w-4" />
          Regel Toevoegen
        </Button>
      </div>

      {/* Stylist selector */}
      <div className="mb-6 max-w-xs">
        <Label>Kapper</Label>
        <Select value={selectedStylist} onValueChange={setSelectedStylist}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecteer kapper" />
          </SelectTrigger>
          <SelectContent>
            {stylists.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rules */}
      <div className="space-y-3">
        {rules.length === 0 && !loading && (
          <p className="text-[#A0A0A0]">Geen beschikbaarheidsregels. Voeg er een toe.</p>
        )}
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-4 grid grid-cols-2 md:grid-cols-5 gap-3 items-end"
          >
            <div>
              <Label className="text-xs">Dag</Label>
              <Select
                value={String(rule.day_of_week)}
                onValueChange={(v) => updateRule(rule.id, 'day_of_week', parseInt(v))}
              >
                <SelectTrigger className="mt-1 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Van</Label>
              <Input
                type="time"
                value={rule.start_time.slice(0, 5)}
                onChange={(e) => updateRule(rule.id, 'start_time', e.target.value)}
                className="mt-1 h-9"
              />
            </div>
            <div>
              <Label className="text-xs">Tot</Label>
              <Input
                type="time"
                value={rule.end_time.slice(0, 5)}
                onChange={(e) => updateRule(rule.id, 'end_time', e.target.value)}
                className="mt-1 h-9"
              />
            </div>
            <div>
              <Label className="text-xs">Buffer (min)</Label>
              <Input
                type="number"
                value={rule.buffer_minutes}
                onChange={(e) => updateRule(rule.id, 'buffer_minutes', parseInt(e.target.value))}
                className="mt-1 h-9"
              />
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={() => void saveRule(rule)}
                className="flex-1 gap-1"
              >
                <Save className="h-3.5 w-3.5" />
                Opslaan
              </Button>
              <button
                onClick={() => void deleteRule(rule.id)}
                className="p-2 rounded text-red-400 hover:bg-red-400/10 border border-[#2A2A2A]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
