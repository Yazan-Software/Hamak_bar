import HeroSection from '@/components/home/HeroSection'
import FeaturedServices from '@/components/home/FeaturedServices'
import ReviewCarousel from '@/components/home/ReviewCarousel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Award, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedServices />

      {/* Why choose us */}
      <section className="py-24 px-4 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Waarom Hamak Bar</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#FAFAFA]">
              De Hamak Bar Belofte
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Premium Vakmanschap',
                desc: 'Onze kappers zijn gecertificeerde professionals met jarenlange ervaring. Elk kapsel is een kunstwerk.',
              },
              {
                icon: Shield,
                title: 'Hygiëne Gegarandeerd',
                desc: 'Wij werken met de hoogste hygiënestandaarden. Alle materialen worden na elk gebruik gereinigd.',
              },
              {
                icon: Clock,
                title: 'Altijd Op Tijd',
                desc: 'Wij respecteren jouw tijd. Afspraken beginnen op tijd zodat jij nooit lang hoeft te wachten.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-[#C9A96E]" />
                  </div>
                </div>
                <h3 className="font-playfair text-xl font-semibold text-[#FAFAFA] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#A0A0A0] text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReviewCarousel />

      {/* Gallery strip */}
      <section className="py-24 px-4 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Ons Werk</p>
            <h2 className="font-playfair text-4xl font-bold text-[#FAFAFA]">Galerij</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[#111111] border border-[#2A2A2A] rounded-lg flex items-center justify-center text-4xl hover:border-[#C9A96E]/40 transition-colors cursor-pointer"
              >
                {['✂️', '💈', '🧔', '💇', '🪞', '⭐'][i]}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/gallery">
              <Button variant="outline">Bekijk Alle Foto&#39;s</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-[#111111] border-y border-[#2A2A2A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-6">
            Klaar voor jouw{' '}
            <span className="text-[#C9A96E]">premium ervaring</span>?
          </h2>
          <p className="text-[#A0A0A0] mb-8">
            Boek nu online of bel ons voor een afspraak. We kijken ernaar uit je te verwelkomen!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="xl">Boek Afspraak</Button>
            </Link>
            <Link href="/contact">
              <Button size="xl" variant="outline">Neem Contact Op</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
