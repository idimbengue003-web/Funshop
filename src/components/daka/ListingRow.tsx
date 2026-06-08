'use client'

import { memo } from 'react'
import { type Listing } from '@/lib/store'
import { getPremiumLabel, getStarsFromSales } from '@/lib/constants'
import { useDakaStore } from '@/lib/store'
import { MapPin, Star, Crown } from 'lucide-react'

interface ListingRowProps {
  listing: Listing
  isLast?: boolean
}

export const ListingRow = memo(function ListingRow({ listing, isLast = false }: ListingRowProps) {
  const { openModal } = useDakaStore()
  const stars = getStarsFromSales(listing.seller.sales)
  const premiumInfo = getPremiumLabel(listing.seller.premium)

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${!isLast ? 'border-b border-border/50' : ''}`}
      onClick={() => openModal({ type: 'listingDetail', listingId: listing.id })}
    >
      {/* Category icon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: `${listing.category.color}12` }}
      >
        {listing.category.icon}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm truncate">{listing.title}</span>
          {listing.isPremium && <Crown className="w-3 h-3 text-[#f5a623] shrink-0" />}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span className="font-medium text-foreground/60">{listing.seller.name}</span>
          {premiumInfo && (
            <span className="font-bold" style={{ color: premiumInfo.color, fontSize: '9px' }}>
              {premiumInfo.label}
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5" />
            {listing.quartier}
          </span>
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-2 h-2 ${i < Math.floor(stars) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
          </span>
        </div>
      </div>

      {/* Price - right aligned like FunPay */}
      <div className="text-right shrink-0">
        <span className="font-bold text-sm text-[#2a2d35]">
          {listing.price.toLocaleString('fr-FR')}
        </span>
        <span className="text-[10px] text-muted-foreground ml-0.5">FCFA</span>
        <div className="text-[10px] text-muted-foreground">/{listing.unit}</div>
      </div>
    </div>
  )
})
