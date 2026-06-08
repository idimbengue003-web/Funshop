'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useDakaStore, type Listing } from '@/lib/store'
import { CategoryGrid } from './CategoryGrid'
import { ListingRow } from './ListingRow'
import { Crown, Flame, TrendingUp } from 'lucide-react'

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
      setPremiumListings((data.listings || []).slice(0, 10))
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
    <div className="space-y-5">
      {/* Search results message */}
      {searchQuery && (
        <div className="p-3 rounded bg-amber-50 border border-amber-200 text-sm text-amber-800">
          Recherche de &laquo;&nbsp;{searchQuery}&nbsp;&raquo; &mdash; S&eacute;lectionnez une cat&eacute;gorie pour voir les r&eacute;sultats
        </div>
      )}

      {/* Categories - FunPay style grid */}
      <CategoryGrid />

      {/* VIP/Premium offers - FunPay "promo" style */}
      {premiumListings.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-3.5 h-3.5 text-[#f5a623]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Offres VIP</h2>
            <Crown className="w-3.5 h-3.5 text-[#f5a623]" />
          </div>
          <div className="bg-white rounded border border-border overflow-hidden">
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

      {/* Footer info */}
      <div className="text-center py-4 text-xs text-muted-foreground">
        FUNSHOP &mdash; Comparez les prix alimentaires &agrave; Dakar
      </div>
    </div>
  )
}
