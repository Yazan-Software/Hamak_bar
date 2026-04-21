import { createClient } from '@/lib/supabase/server'
import { Calendar, DollarSign, Clock, Users } from 'lucide-react'
import { format } from 'date-fns'
import { formatPrice } from '@/lib/utils'
import type { Booking } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  const [
    { count: totalBookings },
    { count: todayBookings },
    { count: pendingBookings },
    { data: payments },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('start_time', `${today}T00:00:00`)
      .lte('start_time', `${today}T23:59:59`),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('payments').select('amount').eq('status', 'succeeded'),
    supabase
      .from('bookings')
      .select('*, service:services(name), stylist:stylists(name)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const totalRevenue = (payments ?? []).reduce(
    (sum: number, p: { amount: number }) => sum + p.amount,
    0
  )

  const stats = [
    {
      label: 'Totale Boekingen',
      value: totalBookings ?? 0,
      icon: Calendar,
      color: 'text-blue-400',
    },
    {
      label: 'Vandaag',
      value: todayBookings ?? 0,
      icon: Clock,
      color: 'text-green-400',
    },
    {
      label: 'In Behandeling',
      value: pendingBookings ?? 0,
      icon: Users,
      color: 'text-orange-400',
    },
    {
      label: 'Totale Omzet',
      value: formatPrice(totalRevenue / 100),
      icon: DollarSign,
      color: 'text-[#C9A96E]',
    },
  ]

  const STATUS_COLORS: Record<string, string> = {
    pending: 'text-orange-400',
    confirmed: 'text-green-400',
    completed: 'text-blue-400',
    cancelled: 'text-red-400',
    no_show: 'text-gray-400',
  }

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-[#FAFAFA] mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#A0A0A0] text-sm">{stat.label}</p>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg">
        <div className="p-5 border-b border-[#2A2A2A]">
          <h2 className="font-playfair text-lg font-semibold text-[#FAFAFA]">
            Recente Boekingen
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#A0A0A0]">
                {['Klant', 'Service', 'Kapper', 'Datum', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentBookings ?? []).map((booking: Booking & { service?: { name: string } | null; stylist?: { name: string } | null }) => (
                <tr
                  key={booking.id}
                  className="border-b border-[#2A2A2A] last:border-0 hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="px-5 py-3 text-[#FAFAFA]">{booking.customer_name}</td>
                  <td className="px-5 py-3 text-[#A0A0A0]">{booking.service?.name ?? '–'}</td>
                  <td className="px-5 py-3 text-[#A0A0A0]">{booking.stylist?.name ?? 'Geen voorkeur'}</td>
                  <td className="px-5 py-3 text-[#A0A0A0]">
                    {format(new Date(booking.start_time), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className={`px-5 py-3 font-medium ${STATUS_COLORS[booking.status] ?? 'text-[#A0A0A0]'}`}>
                    {booking.status}
                  </td>
                </tr>
              ))}
              {(!recentBookings || recentBookings.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#A0A0A0]">
                    Geen boekingen gevonden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
