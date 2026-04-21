import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { CartProvider } from '@/context/CartContext'

export const metadata: Metadata = {
  title: 'Hamak Bar — Premium Barber Experience',
  description: 'Book your premium barber experience at Hamak Bar. Expert haircuts, beard grooming, and styling services.',
  keywords: 'barber, barbershop, haircut, beard trim, men grooming, Hamak Bar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0A0A0A] text-[#FAFAFA] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        <CartProvider>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: '#111111',
                border: '1px solid #2A2A2A',
                color: '#FAFAFA',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}
