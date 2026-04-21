import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Stylist } from '@/types'

interface StylistCardProps {
  stylist: Stylist
}

export default function StylistCard({ stylist }: StylistCardProps) {
  const initials = stylist.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-6 text-center hover:border-[#C9A96E]/30 transition-colors">
      <div className="flex justify-center mb-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={stylist.avatar_url ?? undefined} alt={stylist.name} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
      </div>
      <h3 className="font-playfair text-xl font-semibold text-[#FAFAFA] mb-2">
        {stylist.name}
      </h3>
      {stylist.bio && (
        <p className="text-[#A0A0A0] text-sm mb-4">{stylist.bio}</p>
      )}
      {stylist.specialties.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {stylist.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
