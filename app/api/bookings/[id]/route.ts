import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*, service:services(*), stylist:stylists(*)')
    .eq('id', id)
    .single()

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  return NextResponse.json({ booking })
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = createAdminClient()
  const body = await request.json() as { status?: string; payment_status?: string }

  const updateData: Record<string, string> = {}
  if (body.status) updateData.status = body.status
  if (body.payment_status) updateData.payment_status = body.payment_status

  const { data: booking, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ booking })
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = createAdminClient()

  const { error } = await supabase.from('bookings').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
