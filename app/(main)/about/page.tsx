import { Scissors, Award, Heart, Users } from 'lucide-react'
import StylistCard from '@/components/shared/StylistCard'
import type { Stylist } from '@/types'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: stylists } = await supabase
    .from('stylists')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return (
    <div>
      {/* Hero */}
      <section className="py-24 px-4 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Ons Verhaal</p>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-[#FAFAFA] mb-6">
            Over Hamak Bar
          </h1>
          <p className="text-[#A0A0A0] text-lg leading-relaxed">
            Hamak Bar werd opgericht met één doel: een premium barber ervaring bieden die verder gaat
            dan een simpele knipbeurt. We geloven dat een goed kapsel jouw zelfvertrouwen boost en
            jouw dag beter maakt.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 bg-[#111111] border-y border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-playfair text-3xl font-bold text-[#FAFAFA] mb-4">
              Vakmanschap en{' '}
              <span className="text-[#C9A96E]">Passie</span>
            </h2>
            <p className="text-[#A0A0A0] mb-4">
              Al meer dan 8 jaar bedienen we klanten in de regio met de hoogste kwaliteit barbershop
              services. Onze kappers zijn opgeleid in de beste scholen en houden hun vaardigheden
              constant bij met de nieuwste trends en technieken.
            </p>
            <p className="text-[#A0A0A0]">
              Bij Hamak Bar draait het niet alleen om het haar – het gaat om de complete ervaring.
              Van het moment dat je binnenkomt tot je de deur uitloopt, zorgen we dat je je als een
              VIP voelt.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Scissors, label: 'Expert Kappers' },
              { icon: Award, label: 'Premium Kwaliteit' },
              { icon: Heart, label: 'Passie voor Vak' },
              { icon: Users, label: '500+ Klanten' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 flex flex-col items-center text-center"
              >
                <item.icon className="h-6 w-6 text-[#C9A96E] mb-2" />
                <span className="text-sm text-[#FAFAFA] font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '8+', label: 'Jaar Ervaring' },
            { value: '500+', label: 'Tevreden Klanten' },
            { value: '3', label: 'Expert Kappers' },
            { value: '4.9', label: 'Gemiddelde Score' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-playfair text-4xl font-bold text-[#C9A96E] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#A0A0A0]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 bg-[#111111] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Ons Team</p>
            <h2 className="font-playfair text-4xl font-bold text-[#FAFAFA]">
              Ontmoet de Kappers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(stylists ?? []).map((stylist: Stylist) => (
              <StylistCard key={stylist.id} stylist={stylist} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
