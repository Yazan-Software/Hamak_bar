'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const GALLERY_ITEMS = [
  { id: 1, emoji: '✂️', category: 'haircut', title: 'Klassieke Knipbeurt' },
  { id: 2, emoji: '💈', category: 'fade', title: 'Skin Fade' },
  { id: 3, emoji: '🧔', category: 'beard', title: 'Baard Styling' },
  { id: 4, emoji: '💇', category: 'haircut', title: 'Modern Kapsel' },
  { id: 5, emoji: '🪞', category: 'fade', title: 'Fade met Design' },
  { id: 6, emoji: '⭐', category: 'beard', title: 'Complete Verzorging' },
  { id: 7, emoji: '✂️', category: 'haircut', title: 'Zakelijk Kapsel' },
  { id: 8, emoji: '💈', category: 'fade', title: 'High Fade' },
  { id: 9, emoji: '🎨', category: 'color', title: 'Highlights' },
]

const FILTERS = [
  { key: 'all', label: 'Alle' },
  { key: 'haircut', label: 'Knipbeurten' },
  { key: 'fade', label: 'Fades' },
  { key: 'beard', label: 'Baard' },
  { key: 'color', label: 'Kleur' },
]

export default function GalleryPage() {
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered =
    filter === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((i) => i.category === filter)

  return (
    <div className="py-16 px-4 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Portfolio</p>
          <h1 className="font-playfair text-5xl font-bold text-[#FAFAFA]">Galerij</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === f.key
                  ? 'bg-[#C9A96E] text-[#0A0A0A] font-semibold'
                  : 'border border-[#2A2A2A] text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative bg-[#111111] border border-[#2A2A2A] rounded-lg overflow-hidden cursor-pointer hover:border-[#C9A96E]/40 transition-colors ${
                i % 3 === 1 ? 'md:row-span-2' : ''
              }`}
              style={{ aspectRatio: i % 3 === 1 ? '1/2' : '1/1' }}
              onClick={() => setLightbox(item.id)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl">{item.emoji}</span>
              </div>
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-end">
                <p className="text-white text-sm font-medium p-3 opacity-0 hover:opacity-100 transition-opacity">
                  {item.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-[#C9A96E]"
              onClick={() => setLightbox(null)}
            >
              <X className="h-6 w-6" />
            </button>
            {(() => {
              const item = GALLERY_ITEMS.find((i) => i.id === lightbox)
              return (
                <div
                  className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-12 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-9xl">{item?.emoji}</span>
                  <p className="text-[#FAFAFA] text-xl mt-4 font-playfair">{item?.title}</p>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
