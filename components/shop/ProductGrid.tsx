'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
}

const CATEGORIES = ['Alle', 'Pomade', 'Beard', 'Hair', 'Skincare']

export default function ProductGrid({ products }: ProductGridProps) {
  const [category, setCategory] = useState('Alle')

  const filtered = category === 'Alle'
    ? products
    : products.filter(
        (p) => p.category?.toLowerCase().includes(category.toLowerCase())
      )

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              category === cat
                ? 'bg-[#C9A96E] text-[#0A0A0A] font-semibold'
                : 'border border-[#2A2A2A] text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#A0A0A0] py-12">
          Geen producten gevonden in deze categorie.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
