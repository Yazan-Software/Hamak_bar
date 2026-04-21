import BookingWizard from '@/components/booking/BookingWizard'
import { Scissors } from 'lucide-react'

export default function BookingPage() {
  return (
    <div className="py-16 px-4 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 mb-4">
            <Scissors className="h-6 w-6 text-[#C9A96E]" />
          </div>
          <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Online Reserveren</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-4">
            Boek een Afspraak
          </h1>
          <p className="text-[#A0A0A0]">
            Kies je service, kapper en tijdstip. Betaal online of bij aankomst.
          </p>
        </div>

        <BookingWizard />
      </div>
    </div>
  )
}
