import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/booking/availability'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const serviceId = searchParams.get('service_id')
  const stylistId = searchParams.get('stylist_id')
  const dateStr = searchParams.get('date')

  if (!serviceId || !dateStr) {
    return NextResponse.json(
      { error: 'service_id and date are required' },
      { status: 400 }
    )
  }

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    const slots = await getAvailableSlots(serviceId, stylistId, date)
    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Availability error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
