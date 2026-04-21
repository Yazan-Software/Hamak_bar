import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe/client'
import { addMinutes, format, parseISO } from 'date-fns'

export async function GET() {
  const supabase = createAdminClient()
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, service:services(name), stylist:stylists(name)')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ bookings })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      service_id: string
      stylist_id?: string | null
      date: string
      time: string
      customer_name: string
      customer_email: string
      customer_phone?: string
      notes?: string
      user_id?: string
    }

    const {
      service_id,
      stylist_id,
      date,
      time,
      customer_name,
      customer_email,
      customer_phone,
      notes,
      user_id,
    } = body

    if (!service_id || !date || !time || !customer_name || !customer_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get service details
    const { data: service } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .eq('is_active', true)
      .single()

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Get stylist if provided
    let stylist = null
    let actualStylistId = stylist_id ?? null
    if (stylist_id) {
      const { data } = await supabase
        .from('stylists')
        .select('*')
        .eq('id', stylist_id)
        .single()
      stylist = data
    } else {
      // Find any available stylist
      const { data: stylists } = await supabase
        .from('stylists')
        .select('*')
        .eq('is_active', true)
        .limit(1)
      if (stylists && stylists.length > 0) {
        actualStylistId = stylists[0].id
      }
    }

    // Calculate start/end times
    const startTime = new Date(`${date}T${time}:00`)
    const endTime = addMinutes(startTime, service.duration_minutes)

    // Concurrency-safe: check for existing bookings in this slot
    const { data: conflicting } = await supabase
      .from('bookings')
      .select('id')
      .not('status', 'in', '("cancelled","no_show")')
      .eq('stylist_id', actualStylistId ?? '')
      .or(`start_time.lt.${endTime.toISOString()},end_time.gt.${startTime.toISOString()}`)
      .gte('start_time', startTime.toISOString())
      .lt('end_time', endTime.toISOString())

    if (conflicting && conflicting.length > 0) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      )
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user_id ?? null,
        service_id,
        stylist_id: actualStylistId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'pending',
        payment_status: 'pending',
        total_price: service.price,
        deposit_amount: service.deposit_amount,
        customer_name,
        customer_email,
        customer_phone: customer_phone ?? null,
        notes: notes ?? null,
      })
      .select()
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    // If service is free, confirm immediately
    if (service.price <= 0) {
      await supabase
        .from('bookings')
        .update({ status: 'confirmed', payment_status: 'paid' })
        .eq('id', booking.id)
      return NextResponse.json({ booking_id: booking.id, free: true })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      mode: 'payment',
      customer_email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: service.name,
              description: `Afspraak op ${format(startTime, 'dd-MM-yyyy')} om ${time}`,
            },
            unit_amount: Math.round(service.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        booking_id: booking.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/confirmation?id=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking`,
    })

    // Update booking with session ID
    await supabase
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id)

    return NextResponse.json({ checkout_url: session.url })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
