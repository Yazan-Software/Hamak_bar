'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Minus, Plus, ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: state.items }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error ?? 'Kon geen checkout aanmaken')
      }
    } catch {
      toast.error('Er is een fout opgetreden')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#0A0A0A] border-l border-[#2A2A2A] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#C9A96E]" />
                <h2 className="font-playfair text-lg font-semibold text-[#FAFAFA]">
                  Winkelwagen
                </h2>
                {state.items.length > 0 && (
                  <span className="bg-[#C9A96E] text-[#0A0A0A] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {state.items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="text-[#A0A0A0] hover:text-[#FAFAFA]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-[#2A2A2A] mb-3" />
                  <p className="text-[#A0A0A0]">Je winkelwagen is leeg</p>
                </div>
              ) : (
                state.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-[#111111] border border-[#2A2A2A] rounded-lg p-3"
                  >
                    <div className="relative w-16 h-16 rounded-md bg-[#1A1A1A] overflow-hidden shrink-0">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                          🧴
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#FAFAFA] text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[#C9A96E] text-sm font-semibold">
                        {formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded border border-[#2A2A2A] hover:border-[#C9A96E] text-[#A0A0A0] hover:text-[#C9A96E]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-[#FAFAFA] text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded border border-[#2A2A2A] hover:border-[#C9A96E] text-[#A0A0A0] hover:text-[#C9A96E]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto p-1 text-[#A0A0A0] hover:text-red-400"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="p-4 border-t border-[#2A2A2A]">
                <div className="flex justify-between mb-4">
                  <span className="text-[#A0A0A0]">Subtotaal</span>
                  <span className="text-[#FAFAFA] font-semibold">{formatPrice(totalPrice)}</span>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => void handleCheckout()}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verwerken...
                    </>
                  ) : (
                    <>
                      Afrekenen
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <button
                  onClick={clearCart}
                  className="w-full text-xs text-[#A0A0A0] hover:text-red-400 mt-2 transition-colors"
                >
                  Winkelwagen leegmaken
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
