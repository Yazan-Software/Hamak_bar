import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react'
import ContactForm from '@/components/shared/ContactForm'

export default function ContactPage() {
  return (
    <div className="py-16 px-4 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Bereik Ons</p>
          <h1 className="font-playfair text-5xl font-bold text-[#FAFAFA]">Contact</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="font-playfair text-2xl font-semibold text-[#FAFAFA] mb-6">
              Kom Langs
            </h2>

            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="font-medium text-[#FAFAFA]">Adres</p>
                  <p className="text-[#A0A0A0] text-sm">
                    Voorbeeldstraat 123<br />1234 AB Amsterdam
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="font-medium text-[#FAFAFA]">Telefoon</p>
                  <a
                    href="tel:+31201234567"
                    className="text-[#A0A0A0] text-sm hover:text-[#C9A96E]"
                  >
                    +31 (0)20 123 4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="font-medium text-[#FAFAFA]">E-mail</p>
                  <a
                    href="mailto:info@hamakbar.nl"
                    className="text-[#A0A0A0] text-sm hover:text-[#C9A96E]"
                  >
                    info@hamakbar.nl
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="font-medium text-[#FAFAFA]">Openingstijden</p>
                  <div className="text-[#A0A0A0] text-sm space-y-1 mt-1">
                    {[
                      { day: 'Maandag – Vrijdag', hours: '09:00 – 18:00' },
                      { day: 'Zaterdag', hours: '09:00 – 17:00' },
                      { day: 'Zondag', hours: 'Gesloten' },
                    ].map((item) => (
                      <div key={item.day} className="flex justify-between gap-8">
                        <span>{item.day}</span>
                        <span className={item.hours === 'Gesloten' ? 'text-red-400' : ''}>{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="font-medium text-[#FAFAFA] mb-3">Volg Ons</p>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-[#2A2A2A] rounded-lg text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors text-sm"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-[#2A2A2A] rounded-lg text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors text-sm"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-playfair text-2xl font-semibold text-[#FAFAFA] mb-6">
              Stuur een Bericht
            </h2>
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
