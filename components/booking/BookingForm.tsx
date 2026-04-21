'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  customerName: z.string().min(2, 'Naam is verplicht'),
  customerEmail: z.string().email('Ongeldig e-mailadres'),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface BookingFormProps {
  values: {
    customerName: string
    customerEmail: string
    customerPhone: string
    notes: string
  }
  onChange: {
    setCustomerName: (v: string) => void
    setCustomerEmail: (v: string) => void
    setCustomerPhone: (v: string) => void
    setNotes: (v: string) => void
  }
  onValidChange: (valid: boolean) => void
}

export default function BookingForm({ values, onChange, onValidChange }: BookingFormProps) {
  const {
    register,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: values,
  })

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="booking-name">Volledige Naam *</Label>
        <Input
          id="booking-name"
          placeholder="Jan de Vries"
          value={values.customerName}
          {...register('customerName')}
          onChange={(e) => {
            onChange.setCustomerName(e.target.value)
            void trigger('customerName').then((valid) => onValidChange(valid))
          }}
          className="mt-1"
        />
        {errors.customerName && (
          <p className="text-red-400 text-xs mt-1">{errors.customerName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="booking-email">E-mailadres *</Label>
        <Input
          id="booking-email"
          type="email"
          placeholder="jan@email.nl"
          value={values.customerEmail}
          {...register('customerEmail')}
          onChange={(e) => {
            onChange.setCustomerEmail(e.target.value)
            void trigger('customerEmail').then((valid) => onValidChange(valid))
          }}
          className="mt-1"
        />
        {errors.customerEmail && (
          <p className="text-red-400 text-xs mt-1">{errors.customerEmail.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="booking-phone">Telefoonnummer</Label>
        <Input
          id="booking-phone"
          type="tel"
          placeholder="+31 6 12345678"
          value={values.customerPhone}
          {...register('customerPhone')}
          onChange={(e) => onChange.setCustomerPhone(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="booking-notes">Opmerkingen</Label>
        <textarea
          id="booking-notes"
          placeholder="Bijzondere wensen of opmerkingen..."
          rows={3}
          value={values.notes}
          onChange={(e) => onChange.setNotes(e.target.value)}
          className="mt-1 flex w-full rounded-md border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-[#A0A0A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] resize-none"
        />
      </div>
    </div>
  )
}
