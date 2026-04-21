'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const REVIEWS = [
  {
    id: 1,
    name: 'Thomas van der Berg',
    rating: 5,
    comment: 'Absoluut de beste barbershop van de stad! Mohammed heeft een ongelooflijk oog voor detail. Mijn skin fade ziet er elke keer weer perfect uit.',
    service: 'Skin Fade',
  },
  {
    id: 2,
    name: 'Youssef El Amrani',
    rating: 5,
    comment: 'Geweldige ervaring! De sfeer is top, de kappers zijn professioneel en het resultaat overtreft altijd mijn verwachtingen.',
    service: 'Beard Treatment',
  },
  {
    id: 3,
    name: 'Pieter Janssen',
    rating: 5,
    comment: 'Hamak Bar is mijn vaste barbershop. Ahmed begrijpt precies wat ik wil zonder dat ik veel hoef uit te leggen. Aanrader!',
    service: 'Classic Haircut',
  },
  {
    id: 4,
    name: 'Kevin Smit',
    rating: 4,
    comment: 'Uitstekende service en een prettige sfeer. Mijn baard is nog nooit zo goed onderhouden geweest. Echt een premium ervaring.',
    service: 'Beard Treatment',
  },
  {
    id: 5,
    name: 'Mehmet Yilmaz',
    rating: 5,
    comment: 'Top zaak! Altijd een warm welkom, perfecte koffie tijdens het wachten en de knipbeurt is elke keer een kunstwerk.',
    service: 'Hair Color',
  },
]

export default function ReviewCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % REVIEWS.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [next])

  return (
    <section className="py-24 px-4 bg-[#111111]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Wat Klanten Zeggen</p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-4">
            Klant Reviews
          </h2>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-5 w-5 fill-[#C9A96E] text-[#C9A96E]" />
            ))}
            <span className="text-[#A0A0A0] ml-2 text-sm">4.9/5 gemiddeld</span>
          </div>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-8 text-center"
            >
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: REVIEWS[current].rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#C9A96E] text-[#C9A96E]" />
                ))}
              </div>
              <p className="text-[#FAFAFA] text-lg italic mb-6 leading-relaxed">
                &ldquo;{REVIEWS[current].comment}&rdquo;
              </p>
              <p className="font-semibold text-[#C9A96E] mb-1">{REVIEWS[current].name}</p>
              <p className="text-sm text-[#A0A0A0]">{REVIEWS[current].service}</p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-[#2A2A2A] text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? 'w-8 bg-[#C9A96E]' : 'w-2 bg-[#2A2A2A]'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full border border-[#2A2A2A] text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
