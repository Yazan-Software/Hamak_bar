'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Euro, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Service } from '@/types'
import { formatPrice } from '@/lib/utils'

const FEATURED_SERVICES = [
  {
    id: 'haircut',
    name: 'Klassieke Knipbeurt',
    description: 'Professionele knipbeurt inclusief wassen, knippen en stylen. Altijd een perfect resultaat.',
    duration_minutes: 45,
    price: 25,
    category: 'haircut',
    emoji: '✂️',
  },
  {
    id: 'skinfade',
    name: 'Skin Fade',
    description: 'De populairste stijl op dit moment. Een strakke fade die geleidelijk overgaat van huid naar haar.',
    duration_minutes: 60,
    price: 35,
    category: 'haircut',
    emoji: '💈',
  },
  {
    id: 'beard',
    name: 'Baard Behandeling',
    description: 'Complete baardverzorging inclusief shaping, trimmen en hydratatie. Voor een verzorgde baard.',
    duration_minutes: 45,
    price: 30,
    category: 'beard',
    emoji: '🧔',
  },
]

export default function FeaturedServices() {
  return (
    <section className="py-24 px-4 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Wat Wij Bieden</p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-4">
            Onze Populairste Services
          </h2>
          <p className="text-[#A0A0A0] max-w-xl mx-auto">
            Van klassieke knipbeurten tot moderne stijlen. Wij bieden premium barbershop services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {FEATURED_SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-6 hover:border-[#C9A96E]/30 transition-colors group"
            >
              <div className="text-4xl mb-4">{service.emoji}</div>
              <h3 className="font-playfair text-xl font-semibold text-[#FAFAFA] mb-2 group-hover:text-[#C9A96E] transition-colors">
                {service.name}
              </h3>
              <p className="text-[#A0A0A0] text-sm mb-4">{service.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-[#C9A96E]">
                  <Euro className="h-4 w-4" />
                  <span className="font-semibold">{formatPrice(service.price)}</span>
                </div>
                <div className="flex items-center gap-1 text-[#A0A0A0] text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{service.duration_minutes} min</span>
                </div>
              </div>
              <Link href="/booking">
                <Button variant="outline" size="sm" className="w-full group-hover:bg-[#C9A96E] group-hover:text-[#0A0A0A] transition-colors">
                  Boek Nu
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/services">
            <Button variant="ghost" className="gap-2">
              Alle Services Bekijken
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
