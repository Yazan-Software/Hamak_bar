import ProductGrid from '@/components/shop/ProductGrid'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="py-16 px-4 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Online Winkel</p>
          <h1 className="font-playfair text-5xl font-bold text-[#FAFAFA] mb-4">
            Hamak Bar Shop
          </h1>
          <p className="text-[#A0A0A0] max-w-xl mx-auto">
            Premium haar- en baardverzorgingsproducten voor thuis. Professionele kwaliteit,
            direct aan jou.
          </p>
        </div>

        <ProductGrid products={products ?? []} />
      </div>
    </div>
  )
}
