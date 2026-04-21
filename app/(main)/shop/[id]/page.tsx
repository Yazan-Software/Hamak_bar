import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from './AddToCartButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  return (
    <div className="py-16 px-4 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#C9A96E] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-square bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                🧴
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <Badge variant="gold" className="mb-3">{product.category}</Badge>
            )}
            <h1 className="font-playfair text-4xl font-bold text-[#FAFAFA] mb-3">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-[#C9A96E] mb-4">
              {formatPrice(product.price)}
            </p>
            {product.description && (
              <p className="text-[#A0A0A0] mb-6 leading-relaxed">{product.description}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <AddToCartButton product={product} />
            </div>

            <div className="border-t border-[#2A2A2A] pt-4">
              <p className="text-sm text-[#A0A0A0]">
                Voorraad:{' '}
                <span className={product.stock_quantity > 0 ? 'text-green-400' : 'text-red-400'}>
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} beschikbaar`
                    : 'Uitverkocht'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
