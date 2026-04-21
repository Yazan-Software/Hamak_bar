'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const contactSchema = z.object({
  name: z.string().min(2, 'Naam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Bericht moet minimaal 10 tekens zijn'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('Bericht verzonden! We nemen zo spoedig mogelijk contact op.')
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="contact-name">Naam *</Label>
        <Input
          id="contact-name"
          placeholder="Jouw naam"
          {...register('name')}
          className="mt-1"
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contact-email">E-mail *</Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="jouw@email.nl"
          {...register('email')}
          className="mt-1"
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contact-phone">Telefoon</Label>
        <Input
          id="contact-phone"
          type="tel"
          placeholder="+31 6 12345678"
          {...register('phone')}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="contact-message">Bericht *</Label>
        <textarea
          id="contact-message"
          placeholder="Jouw bericht..."
          rows={4}
          {...register('message')}
          className="mt-1 flex w-full rounded-md border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-[#A0A0A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] resize-none"
        />
        {errors.message && (
          <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Versturen...' : 'Stuur Bericht'}
      </Button>
    </form>
  )
}
