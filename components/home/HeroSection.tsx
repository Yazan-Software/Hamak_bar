'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A]">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #C9A96E 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#C9A96E] text-sm font-medium tracking-[0.3em] uppercase mb-6">
            Premium Barbershop
          </p>
          <h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl font-bold text-[#C9A96E] mb-6 leading-none">
            HAMAK
            <br />
            BAR
          </h1>
          <p className="text-[#A0A0A0] text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Premium Barber Experience — Vakmanschap, stijl en zorg voor de moderne man
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="xl" className="w-full sm:w-auto">
                Boek Afspraak
              </Button>
            </Link>
            <Link href="/services">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Bekijk Services
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '500+', label: 'Tevreden Klanten' },
            { value: '8+', label: 'Jaar Ervaring' },
            { value: '3', label: 'Expert Kappers' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-playfair text-2xl font-bold text-[#C9A96E]">{stat.value}</div>
              <div className="text-xs text-[#A0A0A0] mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 text-[#A0A0A0] animate-bounce" />
      </motion.div>
    </section>
  )
}
