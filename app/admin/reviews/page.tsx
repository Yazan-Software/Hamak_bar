'use client'

import { useState, useEffect } from 'react'
import { Star, Check, X, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Review } from '@/types'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<(Review & { profile?: { full_name: string | null } | null })[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, profile:profiles(full_name)')
      .order('created_at', { ascending: false })
    setReviews(data ?? [])
    setLoading(false)
  }

  useEffect(() => { void fetchReviews() }, [])

  const publish = async (id: string, value: boolean) => {
    await supabase.from('reviews').update({ is_published: value }).eq('id', id)
    toast.success(value ? 'Review gepubliceerd' : 'Review verborgen')
    void fetchReviews()
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze review wilt verwijderen?')) return
    await supabase.from('reviews').delete().eq('id', id)
    toast.success('Review verwijderd')
    void fetchReviews()
  }

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-[#FAFAFA] mb-8">Reviews</h1>

      <div className="space-y-3">
        {loading ? (
          <p className="text-[#A0A0A0]">Laden...</p>
        ) : reviews.length === 0 ? (
          <p className="text-[#A0A0A0]">Geen reviews gevonden</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-[#FAFAFA]">
                    {review.profile?.full_name ?? 'Anoniem'}
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= review.rating
                            ? 'fill-[#C9A96E] text-[#C9A96E]'
                            : 'text-[#2A2A2A]'
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant={review.is_published ? 'default' : 'outline'}>
                    {review.is_published ? 'Gepubliceerd' : 'Verborgen'}
                  </Badge>
                </div>
                {review.comment && (
                  <p className="text-[#A0A0A0] text-sm italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                {!review.is_published ? (
                  <button
                    onClick={() => void publish(review.id, true)}
                    className="p-1.5 rounded text-green-400 hover:bg-green-400/10"
                    title="Publiceren"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => void publish(review.id, false)}
                    className="p-1.5 rounded text-orange-400 hover:bg-orange-400/10"
                    title="Verbergen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => void deleteReview(review.id)}
                  className="p-1.5 rounded text-red-400 hover:bg-red-400/10"
                  title="Verwijderen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
