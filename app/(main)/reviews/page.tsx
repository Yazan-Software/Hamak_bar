import { Star } from 'lucide-react'
import ContactForm from '@/components/shared/ContactForm'
import { createClient } from '@/lib/supabase/server'
import type { Review } from '@/types'

export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {
  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profile:profiles(full_name), stylist:stylists(name)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length
      : 0

  return (
    <div className="py-16 px-4 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C9A96E] text-sm tracking-[0.3em] uppercase mb-3">Klant Ervaringen</p>
          <h1 className="font-playfair text-5xl font-bold text-[#FAFAFA] mb-4">Reviews</h1>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${
                      s <= Math.round(avgRating)
                        ? 'fill-[#C9A96E] text-[#C9A96E]'
                        : 'text-[#2A2A2A]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[#A0A0A0]">
                {avgRating.toFixed(1)} / 5 ({reviews.length} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {(reviews ?? []).map((review: Review & { profile?: { full_name: string | null }; stylist?: { name: string } | null }) => (
            <div
              key={review.id}
              className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-[#FAFAFA]">
                    {review.profile?.full_name ?? 'Anoniem'}
                  </p>
                  {review.stylist && (
                    <p className="text-xs text-[#A0A0A0]">bij {review.stylist.name}</p>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= review.rating
                          ? 'fill-[#C9A96E] text-[#C9A96E]'
                          : 'text-[#2A2A2A]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-[#A0A0A0] text-sm italic">&ldquo;{review.comment}&rdquo;</p>
              )}
            </div>
          ))}

          {(!reviews || reviews.length === 0) && (
            <div className="col-span-2 text-center py-12 text-[#A0A0A0]">
              Nog geen reviews. Wees de eerste!
            </div>
          )}
        </div>

        {/* Leave a review */}
        <div className="max-w-xl mx-auto">
          <h2 className="font-playfair text-2xl font-semibold text-[#FAFAFA] mb-6 text-center">
            Laat een Review Achter
          </h2>
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-6">
            <p className="text-[#A0A0A0] text-sm text-center mb-4">
              Log in om een review achter te laten.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
