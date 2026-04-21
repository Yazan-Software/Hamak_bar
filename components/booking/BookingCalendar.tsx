'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { nl } from 'date-fns/locale'
import { format, isBefore, startOfDay } from 'date-fns'

interface BookingCalendarProps {
  selected: Date | null
  onSelect: (date: Date) => void
}

export default function BookingCalendar({ selected, onSelect }: BookingCalendarProps) {
  const today = startOfDay(new Date())

  return (
    <div className="flex justify-center">
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-4">
        <DayPicker
          mode="single"
          selected={selected ?? undefined}
          onSelect={(day) => day && onSelect(day)}
          disabled={[
            { before: today },
            { dayOfWeek: [0] }, // Closed on Sunday
          ]}
          locale={nl}
          modifiersClassNames={{
            selected: 'bg-[#C9A96E] text-[#0A0A0A] font-bold rounded-md',
            today: 'text-[#C9A96E] font-bold',
            disabled: 'text-[#3A3A3A] cursor-not-allowed',
          }}
          styles={{
            root: { color: '#FAFAFA' },
            caption: { color: '#FAFAFA' },
            head_cell: { color: '#A0A0A0' },
            day: {
              color: '#FAFAFA',
              borderRadius: '0.375rem',
            },
            nav_button: {
              color: '#C9A96E',
              backgroundColor: 'transparent',
              border: '1px solid #2A2A2A',
              borderRadius: '0.375rem',
              padding: '0.25rem',
            },
          }}
          className="rdp-custom"
        />
      </div>
    </div>
  )
}
