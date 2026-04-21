'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  ShoppingBag,
  Star,
  Clock,
  Scissors as ScissorsIcon,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Boekingen', icon: Calendar },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/products', label: 'Producten', icon: ShoppingBag },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/availability', label: 'Beschikbaarheid', icon: Clock },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-[#0A0A0A] border-r border-[#2A2A2A] flex flex-col">
      <div className="p-6 border-b border-[#2A2A2A]">
        <Link href="/" className="flex items-center gap-2">
          <ScissorsIcon className="h-5 w-5 text-[#C9A96E]" />
          <span className="font-playfair text-lg font-bold text-[#C9A96E]">HAMAK BAR</span>
        </Link>
        <p className="text-xs text-[#A0A0A0] mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors group',
                isActive
                  ? 'bg-[#C9A96E]/10 text-[#C9A96E] border border-[#C9A96E]/20'
                  : 'text-[#A0A0A0] hover:text-[#FAFAFA] hover:bg-[#111111]'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-[#2A2A2A]">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-[#C9A96E] transition-colors"
        >
          ← Terug naar website
        </Link>
      </div>
    </aside>
  )
}
