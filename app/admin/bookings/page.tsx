'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { Check, X, CheckCircle, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'
import type { Booking } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'secondary',
  confirmed: 'default',
  completed: 'default',
  cancelled: 'destructive',
  no_show: 'outline',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'In behandeling',
  confirmed: 'Bevestigd',
  completed: 'Voltooid',
  cancelled: 'Geannuleerd',
  no_show: 'Niet Verschenen',
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<(Booking & { service?: { name: string } | null; stylist?: { name: string } | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings')
    if (res.ok) {
      const data = await res.json() as { bookings: (Booking & { service?: { name: string } | null; stylist?: { name: string } | null })[] }
      setBookings(data.bookings ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    void fetchBookings()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      toast.success('Status bijgewerkt')
      void fetchBookings()
    } else {
      toast.error('Kon status niet bijwerken')
    }
  }

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-[#FAFAFA] mb-8">Boekingen</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0A0]" />
          <Input
            placeholder="Zoek op naam of e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                statusFilter === s
                  ? 'bg-[#C9A96E] text-[#0A0A0A] font-semibold'
                  : 'border border-[#2A2A2A] text-[#A0A0A0] hover:border-[#C9A96E] hover:text-[#C9A96E]'
              }`}
            >
              {s === 'all' ? 'Alle' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A] text-[#A0A0A0]">
              {['Klant', 'Service', 'Kapper', 'Datum & Tijd', 'Prijs', 'Status', 'Acties'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#A0A0A0]">
                  Laden...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#A0A0A0]">
                  Geen boekingen gevonden
                </td>
              </tr>
            ) : (
              filtered.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-[#2A2A2A] last:border-0 hover:bg-[#1A1A1A]"
                >
                  <td className="px-4 py-3">
                    <p className="text-[#FAFAFA] font-medium">{booking.customer_name}</p>
                    <p className="text-[#A0A0A0] text-xs">{booking.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 text-[#A0A0A0]">
                    {booking.service?.name ?? '–'}
                  </td>
                  <td className="px-4 py-3 text-[#A0A0A0]">
                    {booking.stylist?.name ?? 'Geen voorkeur'}
                  </td>
                  <td className="px-4 py-3 text-[#A0A0A0]">
                    {format(new Date(booking.start_time), 'dd MMM yyyy HH:mm', { locale: nl })}
                  </td>
                  <td className="px-4 py-3 text-[#C9A96E] font-medium">
                    {formatPrice(booking.total_price)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_COLORS[booking.status] as 'default' | 'secondary' | 'destructive' | 'outline' ?? 'outline'}>
                      {STATUS_LABELS[booking.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => void updateStatus(booking.id, 'confirmed')}
                          className="p-1.5 rounded text-green-400 hover:bg-green-400/10"
                          title="Bevestigen"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => void updateStatus(booking.id, 'completed')}
                          className="p-1.5 rounded text-blue-400 hover:bg-blue-400/10"
                          title="Voltooien"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {!['cancelled', 'completed'].includes(booking.status) && (
                        <button
                          onClick={() => void updateStatus(booking.id, 'cancelled')}
                          className="p-1.5 rounded text-red-400 hover:bg-red-400/10"
                          title="Annuleren"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
