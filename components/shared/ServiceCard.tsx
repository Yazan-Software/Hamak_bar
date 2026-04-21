import Link from 'next/link'
import { Clock, Euro } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Service } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ServiceCardProps {
  service: Service
}

const CATEGORY_LABELS: Record<string, string> = {
  haircut: 'Knipbeurt',
  beard: 'Baard',
  color: 'Kleur',
  treatment: 'Behandeling',
  kids: 'Kinderen',
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-6 hover:border-[#C9A96E]/30 transition-all group flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <Badge variant="gold" className="text-xs">
          {CATEGORY_LABELS[service.category] ?? service.category}
        </Badge>
        <span className="text-[#C9A96E] font-semibold font-playfair text-lg">
          {formatPrice(service.price)}
        </span>
      </div>
      <h3 className="font-playfair text-xl font-semibold text-[#FAFAFA] mb-2 group-hover:text-[#C9A96E] transition-colors">
        {service.name}
      </h3>
      {service.description && (
        <p className="text-[#A0A0A0] text-sm mb-4 flex-1">{service.description}</p>
      )}
      <div className="flex items-center gap-3 mb-5 text-sm text-[#A0A0A0]">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{service.duration_minutes} min</span>
        </div>
        {service.deposit_amount > 0 && (
          <div className="flex items-center gap-1">
            <Euro className="h-3.5 w-3.5" />
            <span>Aanbetaling {formatPrice(service.deposit_amount)}</span>
          </div>
        )}
      </div>
      <Link href={`/booking?service=${service.id}`}>
        <Button variant="outline" size="sm" className="w-full">
          Boek Nu
        </Button>
      </Link>
    </div>
  )
}
