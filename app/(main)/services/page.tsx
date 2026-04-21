import ServiceCard from '@/components/shared/ServiceCard'
import type { Service } from '@/types'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { key: 'all', label: 'Alle Services' },
  { key: 'haircut', label: 'Knipbeurten' },
  { key: 'beard', label: 'Baard' },
  { key: 'color', label: 'Kleur' },
  { key: 'treatment', label: 'Behandeling' },
  { key: 'kids', label: 'Kinderen' },
]

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('price')

  const grouped = CATEGORIES.slice(1).reduce<Record<string, Service[]>>((acc, cat) => {
    acc[cat.key] = (services ?? []).filter((s: Service) => s.category === cat.key)
    return acc
  }, {})

  return (
    <div className="py-16 px-4 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Wat Wij Bieden</p>
          <h1 className="font-playfair text-5xl font-bold text-[#FAFAFA] mb-4">Onze Services</h1>
          <p className="text-[#A0A0A0] max-w-xl mx-auto">
            Van klassieke knipbeurten tot moderne stijlen. Elke service wordt uitgevoerd met de
            hoogste aandacht voor detail.
          </p>
        </div>

        {/* Services by category */}
        {CATEGORIES.slice(1).map((cat) => {
          const catServices = grouped[cat.key]
          if (!catServices || catServices.length === 0) return null
          return (
            <div key={cat.key} className="mb-16">
              <h2 className="font-playfair text-2xl font-semibold text-[#FAFAFA] mb-6 pb-2 border-b border-[#2A2A2A]">
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catServices.map((service: Service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          )
        })}

        {(!services || services.length === 0) && (
          <div className="text-center py-12 text-[#A0A0A0]">
            <p>Services worden geladen...</p>
          </div>
        )}
      </div>
    </div>
  )
}
