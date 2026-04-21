'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Scissors, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 tekens zijn'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Succesvol ingelogd!')
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 mb-4">
            <Scissors className="h-6 w-6 text-[#C9A96E]" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-[#FAFAFA]">Inloggen</h1>
          <p className="text-[#A0A0A0] text-sm mt-2">Welkom terug bij Hamak Bar</p>
        </div>

        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
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
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="mt-1"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Inloggen...
                </>
              ) : (
                'Inloggen'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[#A0A0A0] mt-4">
            Nog geen account?{' '}
            <Link href="/register" className="text-[#C9A96E] hover:underline">
              Registreren
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-[#A0A0A0] mt-4">
          <Link href="/" className="hover:text-[#C9A96E]">
            ← Terug naar website
          </Link>
        </p>
      </div>
    </div>
  )
}
