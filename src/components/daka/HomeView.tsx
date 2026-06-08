'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useDakaStore, type Listing } from '@/lib/store'
import { CategoryGrid } from './CategoryGrid'
import { ListingRow } from './ListingRow'
import { Crown, Flame } from 'lucide-react'

export function HomeView() {
  const { searchQuery, setViewState } = useDakaStore()
  const [premiumListings, setPremiumListings] = useState<Listing[]>([])
  const abortRef = useRef<AbortController | null>(null)

  const loadPremium = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/listings?sort=recent&premium=true', { signal: controller.signal })
      if (!res.ok) {
        setPremiumListings([])
        return
      }
      const data = await res.json()
      setPremiumListings((data.listings || []).slice(0, 8))
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setPremiumListings([])
    }
  }, [])

  useEffect(() => {
    loadPremium()
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Search results message */}
      {searchQuery && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
          Recherche de &laquo;&nbsp;{searchQuery}&nbsp;&raquo; &mdash; S&eacute;lectionnez une cat&eacute;gorie pour voir les r&eacute;sultats
        </div>
      )}

      {/* Categories FIRST */}
      <section>
        <CategoryGrid />
      </section>

      {/* VIP/Premium offers AFTER categories - FunPay "promo" style */}
      {premiumListings.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Flame className="w-4 h-4 text-[#f5a623]" />
            <h2 className="text-sm font-bold uppercase tracking-wide">Offres VIP</h2>
            <Crown className="w-4 h-4 text-[#f5a623]" />
          </div>
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            {premiumListings.map((listing, index) => (
              <ListingRow
                key={listing.id}
                listing={listing}
                isLast={index === premiumListings.length - 1}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
