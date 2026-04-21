'use client'

import { useState, useReducer, useCallback } from 'react'
import type { BookingWizardState, Service, Stylist } from '@/types'

type BookingAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_SERVICE'; service: Service }
  | { type: 'SET_STYLIST'; stylist: Stylist | null }
  | { type: 'SET_DATE'; date: Date }
  | { type: 'SET_TIME_SLOT'; timeSlot: string }
  | { type: 'SET_CUSTOMER_NAME'; name: string }
  | { type: 'SET_CUSTOMER_EMAIL'; email: string }
  | { type: 'SET_CUSTOMER_PHONE'; phone: string }
  | { type: 'SET_NOTES'; notes: string }
  | { type: 'RESET' }

const initialState: BookingWizardState = {
  step: 1,
  service: null,
  stylist: null,
  date: null,
  timeSlot: null,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  notes: '',
}

function bookingReducer(state: BookingWizardState, action: BookingAction): BookingWizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'SET_SERVICE':
      return { ...state, service: action.service, stylist: null, date: null, timeSlot: null }
    case 'SET_STYLIST':
      return { ...state, stylist: action.stylist, date: null, timeSlot: null }
    case 'SET_DATE':
      return { ...state, date: action.date, timeSlot: null }
    case 'SET_TIME_SLOT':
      return { ...state, timeSlot: action.timeSlot }
    case 'SET_CUSTOMER_NAME':
      return { ...state, customerName: action.name }
    case 'SET_CUSTOMER_EMAIL':
      return { ...state, customerEmail: action.email }
    case 'SET_CUSTOMER_PHONE':
      return { ...state, customerPhone: action.phone }
    case 'SET_NOTES':
      return { ...state, notes: action.notes }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function useBooking() {
  const [state, dispatch] = useReducer(bookingReducer, initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nextStep = useCallback(() => {
    dispatch({ type: 'SET_STEP', step: state.step + 1 })
  }, [state.step])

  const prevStep = useCallback(() => {
    dispatch({ type: 'SET_STEP', step: Math.max(1, state.step - 1) })
  }, [state.step])

  const setService = useCallback((service: Service) => {
    dispatch({ type: 'SET_SERVICE', service })
  }, [])

  const setStylist = useCallback((stylist: Stylist | null) => {
    dispatch({ type: 'SET_STYLIST', stylist })
  }, [])

  const setDate = useCallback((date: Date) => {
    dispatch({ type: 'SET_DATE', date })
  }, [])

  const setTimeSlot = useCallback((timeSlot: string) => {
    dispatch({ type: 'SET_TIME_SLOT', timeSlot })
  }, [])

  const setCustomerName = useCallback((name: string) => {
    dispatch({ type: 'SET_CUSTOMER_NAME', name })
  }, [])

  const setCustomerEmail = useCallback((email: string) => {
    dispatch({ type: 'SET_CUSTOMER_EMAIL', email })
  }, [])

  const setCustomerPhone = useCallback((phone: string) => {
    dispatch({ type: 'SET_CUSTOMER_PHONE', phone })
  }, [])

  const setNotes = useCallback((notes: string) => {
    dispatch({ type: 'SET_NOTES', notes })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const submitBooking = useCallback(async () => {
    if (!state.service || !state.date || !state.timeSlot) return null

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: state.service.id,
          stylist_id: state.stylist?.id ?? null,
          date: state.date.toISOString().split('T')[0],
          time: state.timeSlot,
          customer_name: state.customerName,
          customer_email: state.customerEmail,
          customer_phone: state.customerPhone,
          notes: state.notes,
        }),
      })

      const data = await response.json() as { checkout_url?: string; booking_id?: string; free?: boolean; error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? 'Booking failed')
      }

      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [state])

  return {
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
    reset,
    submitBooking,
  }
}
