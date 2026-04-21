'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBooking } from '@/hooks/useBooking'
import ServiceSelector from './ServiceSelector'
import StylistSelector from './StylistSelector'
import BookingCalendar from './BookingCalendar'
import TimeSlotPicker from './TimeSlotPicker'
import BookingForm from './BookingForm'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { formatPrice } from '@/lib/utils'

const STEPS = [
  { label: 'Service', step: 1 },
  { label: 'Kapper', step: 2 },
  { label: 'Datum & Tijd', step: 3 },
  { label: 'Gegevens', step: 4 },
  { label: 'Bevestiging', step: 5 },
]

export default function BookingWizard() {
  const router = useRouter()
  const {
    state,
    isLoading,
    error,
    nextStep,
    prevStep,
    setService,
    setStylist,
    setDate,
    setTimeSlot,
    setCustomerName,
    setCustomerEmail,
    setCustomerPhone,
    setNotes,
    submitBooking,
  } = useBooking()

  const [formValid, setFormValid] = useState(false)

  const canGoNext = () => {
    switch (state.step) {
      case 1: return state.service !== null
      case 2: return true
      case 3: return state.date !== null && state.timeSlot !== null
      case 4: return (
        state.customerName.length >= 2 &&
        state.customerEmail.includes('@')
      )
      default: return true
    }
  }

  const handleSubmit = async () => {
    const result = await submitBooking()
    if (!result) return

    if ('checkout_url' in result && result.checkout_url) {
      window.location.href = result.checkout_url as string
    } else if ('booking_id' in result) {
      router.push(`/booking/confirmation?id=${result.booking_id as string}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((step, i) => (
          <div key={step.step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                state.step > step.step
                  ? 'bg-[#C9A96E] text-[#0A0A0A]'
                  : state.step === step.step
                  ? 'border-2 border-[#C9A96E] text-[#C9A96E]'
                  : 'border border-[#2A2A2A] text-[#A0A0A0]'
              }`}
            >
              {state.step > step.step ? (
                <Check className="h-4 w-4" />
              ) : (
                step.step
              )}
            </div>
            <span
              className={`hidden sm:block ml-1 mr-3 text-xs ${
                state.step >= step.step ? 'text-[#C9A96E]' : 'text-[#A0A0A0]'
              }`}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-px mr-3 ${
                  state.step > step.step ? 'bg-[#C9A96E]' : 'bg-[#2A2A2A]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {state.step === 1 && (
              <>
                <h2 className="font-playfair text-xl font-semibold text-[#FAFAFA] mb-6">
                  Kies een Service
                </h2>
                <ServiceSelector selected={state.service} onSelect={setService} />
              </>
            )}

            {state.step === 2 && (
              <>
                <h2 className="font-playfair text-xl font-semibold text-[#FAFAFA] mb-6">
                  Kies een Kapper
                </h2>
                <StylistSelector selected={state.stylist} onSelect={setStylist} />
              </>
            )}

            {state.step === 3 && (
              <>
                <h2 className="font-playfair text-xl font-semibold text-[#FAFAFA] mb-6">
                  Kies een Datum & Tijd
                </h2>
                <BookingCalendar selected={state.date} onSelect={setDate} />
                {state.date && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-[#FAFAFA] mb-3">
                      Beschikbare tijden
                    </h3>
                    <TimeSlotPicker
                      serviceId={state.service!.id}
                      stylistId={state.stylist?.id ?? null}
                      date={state.date}
                      selected={state.timeSlot}
                      onSelect={setTimeSlot}
                    />
                  </div>
                )}
              </>
            )}

            {state.step === 4 && (
              <>
                <h2 className="font-playfair text-xl font-semibold text-[#FAFAFA] mb-6">
                  Jouw Gegevens
                </h2>
                <BookingForm
                  values={{
                    customerName: state.customerName,
                    customerEmail: state.customerEmail,
                    customerPhone: state.customerPhone,
                    notes: state.notes,
                  }}
                  onChange={{
                    setCustomerName,
                    setCustomerEmail,
                    setCustomerPhone,
                    setNotes,
                  }}
                  onValidChange={setFormValid}
                />
              </>
            )}

            {state.step === 5 && (
              <>
                <h2 className="font-playfair text-xl font-semibold text-[#FAFAFA] mb-6">
                  Overzicht & Betaling
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'Service', value: state.service?.name ?? '' },
                    { label: 'Kapper', value: state.stylist?.name ?? 'Geen voorkeur' },
                    {
                      label: 'Datum',
                      value: state.date
                        ? format(state.date, 'EEEE d MMMM yyyy', { locale: nl })
                        : '',
                    },
                    { label: 'Tijd', value: state.timeSlot ?? '' },
                    { label: 'Naam', value: state.customerName },
                    { label: 'E-mail', value: state.customerEmail },
                    { label: 'Telefoon', value: state.customerPhone || '–' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between py-2 border-b border-[#2A2A2A] last:border-0"
                    >
                      <span className="text-[#A0A0A0] text-sm">{item.label}</span>
                      <span className="text-[#FAFAFA] text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 mt-2">
                    <span className="text-[#FAFAFA] font-semibold">Totaal</span>
                    <span className="text-[#C9A96E] font-bold text-lg">
                      {formatPrice(state.service?.price ?? 0)}
                    </span>
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm mt-4 bg-red-400/10 border border-red-400/20 rounded-md p-3">
                    {error}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={prevStep}
          disabled={state.step === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Vorige
        </Button>

        {state.step < 5 ? (
          <Button
            onClick={nextStep}
            disabled={!canGoNext()}
          >
            Volgende
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={() => void handleSubmit()}
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verwerken...
              </>
            ) : (
              <>
                {(state.service?.price ?? 0) > 0 ? 'Betaal Nu' : 'Bevestig Boeking'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
