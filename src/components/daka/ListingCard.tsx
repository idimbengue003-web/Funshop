'use client'

import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { type Listing } from '@/lib/store'
import { getStarsFromSales, getPremiumLabel } from '@/lib/constants'
import { useDakaStore } from '@/lib/store'
import { MapPin, Star, TrendingUp, Crown } from 'lucide-react'

interface ListingCardProps {
  listing: Listing
  stats?: { min: number | null; max: number | null; avg: number | null }
}

export const ListingCard = memo(function ListingCard({ listing, stats }: ListingCardProps) {
  const { openModal } = useDakaStore()
  const isCheapest = stats?.min && listing.price === stats.min
  const stars = getStarsFromSales(listing.seller.sales)
  const premiumInfo = getPremiumLabel(listing.seller.premium)

  return (
    <Card
      className={`overflow-hidden cursor-pointer border-border/60 ${
        listing.isPremium ? 'ring-1 ring-amber-300/40 border-amber-200/50' : ''
      } ${isCheapest ? 'ring-1 ring-green-400/40 border-green-200/50' : ''}`}
      onClick={() => openModal({ type: 'listingDetail', listingId: listing.id })}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2.5">
          {/* Avatar - FunPay style minimal */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded bg-[#f5f5f5] flex items-center justify-center text-xs font-bold text-[#2a2d35]">
              {listing.seller.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            {listing.isPremium && (
              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#f5a623] rounded-full flex items-center justify-center">
                <Star className="w-2 h-2 text-white fill-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-start gap-1">
              <h3 className="font-medium text-sm leading-tight truncate text-[#2a2d35]">{listing.title}</h3>
              {listing.isPremium && <Crown className="w-3 h-3 text-[#f5a623] shrink-0 mt-0.5" />}
            </div>

            {/* Seller + quartier */}
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5 mb-0.5">
              <span className="font-medium text-gray-600">{listing.seller.name}</span>
              {premiumInfo && (
                <span className="text-[9px] font-bold" style={{ color: premiumInfo.color }}>
                  {premiumInfo.label}
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 text-gray-400" />
                {listing.quartier}
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 text-[11px] text-gray-400 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-2 h-2 ${i < Math.floor(stars) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                />
              ))}
              <span className="ml-0.5 text-[10px]">({listing.seller.sales})</span>
            </div>

            {/* Price - FunPay style */}
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-bold text-[#2a2d35]">
                {listing.price.toLocaleString('fr-FR')}
              </span>
              <span className="text-[10px] text-gray-400">FCFA/{listing.unit}</span>
            </div>

            {/* Badges */}
            {stats?.min !== stats?.max && (
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {isCheapest && (
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-[9px] px-1 py-0 h-4">
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                    Moins cher
                  </Badge>
                )}
                {stats.avg && listing.price < stats.avg && !isCheapest && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[9px] px-1 py-0 h-4">
                    Sous la moyenne
                  </Badge>
                )}
                {listing.seller.rating >= 4.5 && (
                  <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[9px] px-1 py-0 h-4">
                    Top vendeur
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Category icon */}
          <span className="text-xl shrink-0 opacity-50">{listing.category.icon}</span>
        </div>
      </CardContent>
    </Card>
  )
})
