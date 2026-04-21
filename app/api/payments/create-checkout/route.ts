import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import type { CartItem } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { items: CartItem[] }
    const { items } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.name,
          description: item.product.description ?? undefined,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
