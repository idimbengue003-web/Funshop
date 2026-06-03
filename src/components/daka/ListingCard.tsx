'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { type Listing } from '@/lib/store'
import { getStarsFromSales, getPremiumLabel } from '@/lib/constants'
import { useDakaStore } from '@/lib/store'
import { MapPin, Star, TrendingUp, Crown, Zap } from 'lucide-react'

interface ListingCardProps {
  listing: Listing
  index: number
  stats?: { min: number | null; max: number | null; avg: number | null }
}

export function ListingCard({ listing, index, stats }: ListingCardProps) {
  const { openModal } = useDakaStore()
  const isCheapest = stats?.min && listing.price === stats.min
  const isExpensive = stats?.max && listing.price === stats.max
  const stars = getStarsFromSales(listing.seller.sales)
  const premiumInfo = getPremiumLabel(listing.seller.premium)

  const handleClick = () => {
    openModal({ type: 'listingDetail', listingId: listing.id })
  }

  return (
    <Card
      className={`group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
        listing.isPremium ? 'ring-1 ring-amber-300/50 border-amber-200' : 'border-border/50 hover:border-orange-200'
      } ${isCheapest ? 'ring-2 ring-green-400/50 border-green-200' : ''}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Seller avatar */}
          <div className="relative shrink-0">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-orange-100 text-orange-700 text-sm font-bold">
                {listing.seller.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {/* Premium star overlay */}
            {listing.isPremium && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                <Star className="w-2.5 h-2.5 text-white fill-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title + Premium badge */}
            <div className="flex items-start gap-1.5">
              <h3 className="font-semibold text-sm leading-tight truncate">{listing.title}</h3>
              {listing.isPremium && (
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              )}
            </div>

            {/* Seller info + Stars */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <span className="font-medium text-foreground/70">{listing.seller.name}</span>
              {premiumInfo && (
                <Badge className="text-[9px] px-1 py-0" style={{
                  backgroundColor: `${premiumInfo.color}15`,
                  color: premiumInfo.color,
                  borderColor: `${premiumInfo.color}30`,
                  fontSize: '9px'
                }}>
                  {premiumInfo.label}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-orange-500" />
                {listing.quartier}
              </span>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-2.5 h-2.5 ${i < Math.floor(stars) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-0.5">({listing.seller.sales})</span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-2">
              <span className="text-lg font-extrabold text-orange-600">
                {listing.price.toLocaleString('fr-FR')}
              </span>
              <span className="text-xs text-muted-foreground mb-0.5">FCFA / {listing.unit}</span>
            </div>

            {/* Price comparison badges */}
            {stats?.min !== stats?.max && (
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                {isCheapest && (
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] px-1.5 py-0">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    Moins cher
                  </Badge>
                )}
                {stats.avg && listing.price < stats.avg && !isCheapest && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0">
                    Sous la moyenne
                  </Badge>
                )}
                {listing.seller.rating >= 4.5 && (
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-[10px] px-1.5 py-0">
                    <Star className="w-3 h-3 mr-0.5 fill-yellow-500" />
                    Top vendeur
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Category badge */}
          <Badge
            variant="secondary"
            className="shrink-0 text-xs"
            style={{
              backgroundColor: `${listing.category.color}15`,
              color: listing.category.color,
              borderColor: `${listing.category.color}30`
            }}
          >
            {listing.category.icon}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
