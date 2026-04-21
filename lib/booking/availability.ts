import { addMinutes, format, parseISO, isWithinInterval, isBefore, isAfter } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import type { TimeSlot } from '@/types'

export async function getAvailableSlots(
  serviceId: string,
  stylistId: string | null,
  date: Date
): Promise<TimeSlot[]> {
  const supabase = await createClient()
  const dayOfWeek = date.getDay()
  const dateStr = format(date, 'yyyy-MM-dd')

  const { data: service } = await supabase
    .from('services')
    .select('duration_minutes')
    .eq('id', serviceId)
    .single()

  if (!service) return []

  let availabilityQuery = supabase
    .from('availability_rules')
    .select('*')
    .eq('day_of_week', dayOfWeek)

  if (stylistId) {
    availabilityQuery = availabilityQuery.eq('stylist_id', stylistId)
  }

  const { data: rules } = await availabilityQuery

  if (!rules || rules.length === 0) return []

  const rule = rules[0]
  const duration = service.duration_minutes
  const buffer = rule.buffer_minutes

  const slots: TimeSlot[] = []
  const [startHour, startMin] = rule.start_time.split(':').map(Number)
  const [endHour, endMin] = rule.end_time.split(':').map(Number)

  const startDate = new Date(date)
  startDate.setHours(startHour, startMin, 0, 0)

  const endDate = new Date(date)
  endDate.setHours(endHour, endMin, 0, 0)

  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .gte('start_time', `${dateStr}T00:00:00`)
    .lte('start_time', `${dateStr}T23:59:59`)
    .not('status', 'in', '("cancelled","no_show")')
    .eq(stylistId ? 'stylist_id' : 'service_id', stylistId ?? serviceId)

  const bookings = existingBookings ?? []

  let current = startDate
  while (isBefore(addMinutes(current, duration), endDate) || addMinutes(current, duration).getTime() === endDate.getTime()) {
    const slotEnd = addMinutes(current, duration)
    const timeStr = format(current, 'HH:mm')

    const isBooked = bookings.some((booking) => {
      const bStart = parseISO(booking.start_time)
      const bEnd = parseISO(booking.end_time)
      return (
        isWithinInterval(current, { start: bStart, end: addMinutes(bEnd, -1) }) ||
        isWithinInterval(slotEnd, { start: addMinutes(bStart, 1), end: bEnd }) ||
        (isBefore(current, bStart) && isAfter(slotEnd, bEnd))
      )
    })

    const isPast = isBefore(current, new Date())

    slots.push({
      time: timeStr,
      available: !isBooked && !isPast,
    })

    current = addMinutes(current, duration + buffer)
  }

  return slots
}
