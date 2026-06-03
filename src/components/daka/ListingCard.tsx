'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { type Listing } from '@/lib/store'
import { MapPin, Star, TrendingUp } from 'lucide-react'

interface ListingCardProps {
  listing: Listing
  index: number
  stats?: { min: number | null; max: number | null; avg: number | null }
}

export function ListingCard({ listing, index, stats }: ListingCardProps) {
  const isCheapest = stats?.min && listing.price === stats.min
  const isExpensive = stats?.max && listing.price === stats.max

  return (
    <Card className={`group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-orange-200 ${
      isCheapest ? 'ring-2 ring-green-400/50 border-green-200' : ''
    } ${isExpensive && stats?.min !== stats?.max ? 'ring-2 ring-red-300/30 border-red-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Seller avatar */}
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback className="bg-orange-100 text-orange-700 text-sm font-bold">
              {listing.seller.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-semibold text-sm leading-tight mb-1 truncate">
              {listing.title}
            </h3>

            {/* Seller info */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="font-medium text-foreground/70">{listing.seller.name}</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-orange-500" />
                {listing.quartier}
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
              <div className="flex items-center gap-1 mt-2 flex-wrap">
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
                {listing.seller.rating > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-[10px] px-1.5 py-0">
                    <Star className="w-3 h-3 mr-0.5 fill-yellow-500" />
                    {listing.seller.rating.toFixed(1)}
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
