import Link from 'next/link'
import { Scissors, Instagram, Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Scissors className="h-6 w-6 text-[#C9A96E]" />
              <span className="font-playfair text-xl font-bold text-[#C9A96E]">HAMAK BAR</span>
            </Link>
            <p className="text-[#A0A0A0] text-sm mb-4">
              Premium barber experience voor de moderne man. Vakmanschap, stijl en zorg op het hoogste niveau.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-[#2A2A2A] text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-[#2A2A2A] text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-playfair font-semibold text-[#FAFAFA] mb-4">Navigatie</h4>
            <ul className="space-y-2">
              {[
                { href: '/services', label: 'Services' },
                { href: '/booking', label: 'Boek Afspraak' },
                { href: '/about', label: 'Over Ons' },
                { href: '/gallery', label: 'Galerij' },
                { href: '/reviews', label: 'Reviews' },
                { href: '/shop', label: 'Webshop' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A0A0A0] hover:text-[#C9A96E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-playfair font-semibold text-[#FAFAFA] mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                'Knipbeurt',
                'Skin Fade',
                'Baard Trim',
                'Baard Behandeling',
                'Haarkleur',
                'Highlights',
                'Kinder Knipbeurt',
                'Haarbehandeling',
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm text-[#A0A0A0]">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair font-semibold text-[#FAFAFA] mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#A0A0A0]">
                <MapPin className="h-4 w-4 text-[#C9A96E] mt-0.5 shrink-0" />
                <span>Voorbeeldstraat 123<br />1234 AB Amsterdam</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                <Phone className="h-4 w-4 text-[#C9A96E] shrink-0" />
                <a href="tel:+31201234567" className="hover:text-[#C9A96E]">+31 (0)20 123 4567</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                <Mail className="h-4 w-4 text-[#C9A96E] shrink-0" />
                <a href="mailto:info@hamakbar.nl" className="hover:text-[#C9A96E]">info@hamakbar.nl</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#A0A0A0]">
                <Clock className="h-4 w-4 text-[#C9A96E] mt-0.5 shrink-0" />
                <span>
                  Ma–Za: 09:00–18:00<br />
                  Zo: Gesloten
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#A0A0A0]">
            © {new Date().getFullYear()} Hamak Bar. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-[#A0A0A0] hover:text-[#C9A96E]">
              Privacybeleid
            </Link>
            <Link href="/terms" className="text-xs text-[#A0A0A0] hover:text-[#C9A96E]">
              Algemene Voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
