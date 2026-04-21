'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Stylist } from '@/types'
import { createClient } from '@/lib/supabase/client'

interface StylistSelectorProps {
  selected: Stylist | null
  onSelect: (stylist: Stylist | null) => void
}

export default function StylistSelector({ selected, onSelect }: StylistSelectorProps) {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStylists = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('stylists')
        .select('*')
        .eq('is_active', true)
        .order('name')
      setStylists(data ?? [])
      setLoading(false)
    }
    void fetchStylists()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-[#111111] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const options = [
    {
      id: 'any',
      name: 'Geen voorkeur',
      bio: 'Eerste beschikbare kapper',
      avatar_url: null,
      specialties: [],
      isAny: true,
    },
    ...stylists.map((s) => ({ ...s, isAny: false })),
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((option) => {
        const initials = option.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()

        const isSelected = option.isAny
          ? selected === null
          : selected?.id === option.id

        return (
          <motion.button
            key={option.id}
            onClick={() => onSelect(option.isAny ? null : (option as Stylist))}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`text-left p-4 rounded-lg border transition-all flex items-start gap-4 ${
              isSelected
                ? 'border-[#C9A96E] bg-[#C9A96E]/10'
                : 'border-[#2A2A2A] bg-[#111111] hover:border-[#C9A96E]/40'
            }`}
          >
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={option.avatar_url ?? undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-[#FAFAFA] truncate">{option.name}</h4>
                {isSelected && <Check className="h-4 w-4 text-[#C9A96E] shrink-0" />}
              </div>
              <p className="text-xs text-[#A0A0A0] mt-0.5">{option.bio}</p>
              {option.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {option.specialties.slice(0, 2).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
