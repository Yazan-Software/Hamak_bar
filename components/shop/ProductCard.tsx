'use client'

import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart()

  const handleAddToCart = () => {
    addItem(product)
    openCart()
  }

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg overflow-hidden group hover:border-[#C9A96E]/30 transition-colors">
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-square bg-[#1A1A1A] overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl">🧴</span>
            </div>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary">Uitverkocht</Badge>
            </div>
          )}
          {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-orange-500/80 text-white text-xs">Nog {product.stock_quantity} over</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {product.category && (
          <Badge variant="gold" className="text-xs mb-2">{product.category}</Badge>
        )}
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-semibold text-[#FAFAFA] mb-1 hover:text-[#C9A96E] transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-xs text-[#A0A0A0] mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[#C9A96E] font-bold text-lg">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            disabled={product.stock_quantity === 0}
            onClick={handleAddToCart}
            className="gap-1"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Toevoegen
          </Button>
        </div>
      </div>
    </div>
  )
}
