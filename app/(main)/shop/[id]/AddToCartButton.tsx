'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()

  return (
    <Button
      size="lg"
      disabled={product.stock_quantity === 0}
      onClick={() => { addItem(product); openCart() }}
      className="flex-1 gap-2"
    >
      <ShoppingCart className="h-5 w-5" />
      {product.stock_quantity > 0 ? 'Toevoegen aan Winkelwagen' : 'Uitverkocht'}
    </Button>
  )
}
