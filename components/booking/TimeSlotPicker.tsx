'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import type { TimeSlot } from '@/types'

interface TimeSlotPickerProps {
  serviceId: string
  stylistId: string | null
  date: Date
  selected: string | null
  onSelect: (time: string) => void
}

export default function TimeSlotPicker({
  serviceId,
  stylistId,
  date,
  selected,
  onSelect,
}: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true)
      const params = new URLSearchParams({
        service_id: serviceId,
        date: format(date, 'yyyy-MM-dd'),
      })
      if (stylistId) params.set('stylist_id', stylistId)

      const res = await fetch(`/api/availability?${params.toString()}`)
      const data = await res.json() as { slots: TimeSlot[] }
      setSlots(data.slots ?? [])
      setLoading(false)
    }
    void fetchSlots()
  }, [serviceId, stylistId, date])

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-10 bg-[#111111] rounded-md animate-pulse" />
        ))}
      </div>
    )
  }

  const available = slots.filter((s) => s.available)

  if (available.length === 0) {
    return (
      <div className="text-center py-8 text-[#A0A0A0]">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Geen beschikbare tijden op {format(date, 'EEEE d MMMM')}</p>
        <p className="text-sm mt-1">Kies een andere datum</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-[#A0A0A0] mb-4">
        {available.length} tijden beschikbaar op {format(date, 'EEEE d MMMM')}
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {slots.map((slot) => (
          <motion.button
            key={slot.time}
            disabled={!slot.available}
            onClick={() => slot.available && onSelect(slot.time)}
            whileHover={slot.available ? { scale: 1.05 } : {}}
            whileTap={slot.available ? { scale: 0.95 } : {}}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
              !slot.available
                ? 'text-[#3A3A3A] cursor-not-allowed bg-[#0A0A0A]'
                : selected === slot.time
                ? 'bg-[#C9A96E] text-[#0A0A0A] font-bold'
                : 'bg-[#111111] border border-[#2A2A2A] text-[#FAFAFA] hover:border-[#C9A96E] hover:text-[#C9A96E]'
            }`}
          >
            {slot.time}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
