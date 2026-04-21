import { Check, Calendar, Home, Scissors } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { formatPrice } from '@/lib/utils'

interface Props {
  searchParams: Promise<{ id?: string }>
}

export default async function BookingConfirmationPage({ searchParams }: Props) {
  const { id } = await searchParams
  
  let booking = null
  if (id) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('bookings')
      .select('*, service:services(*), stylist:stylists(*)')
      .eq('id', id)
      .single()
    booking = data
  }

  return (
    <div className="py-16 px-4 bg-[#0A0A0A] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 mb-6">
          <Check className="h-10 w-10 text-green-400" />
        </div>

        <h1 className="font-playfair text-4xl font-bold text-[#FAFAFA] mb-3">
          Boeking Bevestigd!
        </h1>
        <p className="text-[#A0A0A0] mb-8">
          Je afspraak is succesvol geboekt. Je ontvangt een bevestiging per e-mail.
        </p>

        {booking && (
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6 text-left mb-6">
            <h2 className="font-playfair text-lg font-semibold text-[#FAFAFA] mb-4">
              Boeking Details
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Service', value: booking.service?.name },
                {
                  label: 'Kapper',
                  value: booking.stylist?.name ?? 'Geen voorkeur',
                },
                {
                  label: 'Datum',
                  value: format(new Date(booking.start_time), 'EEEE d MMMM yyyy', { locale: nl }),
                },
                {
                  label: 'Tijd',
                  value: format(new Date(booking.start_time), 'HH:mm'),
                },
                { label: 'Naam', value: booking.customer_name },
                { label: 'E-mail', value: booking.customer_email },
                {
                  label: 'Totaal',
                  value: formatPrice(booking.total_price),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between py-1 border-b border-[#2A2A2A] last:border-0"
                >
                  <span className="text-[#A0A0A0] text-sm">{item.label}</span>
                  <span className="text-[#FAFAFA] text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="secondary" className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Naar Home
            </Button>
          </Link>
          <Link href="/booking">
            <Button className="gap-2 w-full sm:w-auto">
              <Scissors className="h-4 w-4" />
              Nieuwe Boeking
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
