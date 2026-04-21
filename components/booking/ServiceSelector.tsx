'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Euro, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Service } from '@/types'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const CATEGORY_LABELS: Record<string, string> = {
  haircut: 'Knipbeurt',
  beard: 'Baard',
  color: 'Kleur',
  treatment: 'Behandeling',
  kids: 'Kinderen',
}

const CATEGORIES = ['all', 'haircut', 'beard', 'color', 'treatment', 'kids']

interface ServiceSelectorProps {
  selected: Service | null
  onSelect: (service: Service) => void
}

export default function ServiceSelector({ selected, onSelect }: ServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const fetchServices = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category')
      setServices(data ?? [])
      setLoading(false)
    }
    void fetchServices()
  }, [])

  const filtered = category === 'all'
    ? services
    : services.filter((s) => s.category === category)

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-[#111111] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              category === cat
                ? 'bg-[#C9A96E] text-[#0A0A0A] font-semibold'
                : 'border border-[#2A2A2A] text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E]'
            }`}
          >
            {cat === 'all' ? 'Alle' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((service) => (
          <motion.button
            key={service.id}
            onClick={() => onSelect(service)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`text-left p-4 rounded-lg border transition-all ${
              selected?.id === service.id
                ? 'border-[#C9A96E] bg-[#C9A96E]/10'
                : 'border-[#2A2A2A] bg-[#111111] hover:border-[#C9A96E]/40'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <Badge variant="gold" className="text-xs mb-2">
                  {CATEGORY_LABELS[service.category] ?? service.category}
                </Badge>
                <h4 className="font-semibold text-[#FAFAFA]">{service.name}</h4>
              </div>
              {selected?.id === service.id && (
                <Check className="h-5 w-5 text-[#C9A96E] shrink-0" />
              )}
            </div>
            {service.description && (
              <p className="text-xs text-[#A0A0A0] mb-3 line-clamp-2">{service.description}</p>
            )}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-[#C9A96E] font-semibold">{formatPrice(service.price)}</span>
              <span className="text-[#A0A0A0] flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {service.duration_minutes} min
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
