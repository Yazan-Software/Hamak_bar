import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.booking_id

      if (bookingId) {
        // Confirm booking
        await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('id', bookingId)

        // Insert payment record
        await supabase.from('payments').insert({
          booking_id: bookingId,
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_session_id: session.id,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? 'eur',
          status: 'succeeded',
        })
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Find booking by stripe session and cancel it
      const { data: booking } = await supabase
        .from('bookings')
        .select('id')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single()

      if (booking) {
        await supabase
          .from('bookings')
          .update({ status: 'cancelled', payment_status: 'failed' })
          .eq('id', booking.id)
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
