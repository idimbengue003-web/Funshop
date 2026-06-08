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
      className={`funpay-listing-row flex items-center gap-3 px-4 py-2.5 cursor-pointer ${!isLast ? 'border-b border-border/40' : ''}`}
      onClick={() => openModal({ type: 'listingDetail', listingId: listing.id })}
    >
      {/* Seller avatar - FunPay style small avatar */}
      <div className="w-8 h-8 rounded bg-[#f5f5f5] flex items-center justify-center text-xs font-bold text-[#2a2d35] shrink-0 overflow-hidden">
        {listing.seller.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-[#2a2d35] truncate">{listing.title}</span>
          {listing.isPremium && <Crown className="w-3 h-3 text-[#f5a623] shrink-0" />}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
          <span className="font-medium text-gray-600">{listing.seller.name}</span>
          {premiumInfo && (
            <span className="font-bold text-[9px]" style={{ color: premiumInfo.color }}>
              {premiumInfo.label}
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 text-gray-400" />
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

      {/* Price - FunPay style right-aligned orange */}
      <div className="text-right shrink-0">
        <div className="flex items-baseline gap-0.5 justify-end">
          <span className="font-bold text-sm text-[#2a2d35]">
            {listing.price.toLocaleString('fr-FR')}
          </span>
          <span className="text-[10px] text-gray-400">FCFA</span>
        </div>
        <span className="text-[10px] text-gray-400">/{listing.unit}</span>
      </div>

      {/* Category icon - subtle */}
      <span className="text-base shrink-0 opacity-60">{listing.category.icon}</span>
    </div>
  )
})
