'use client'

import { useEffect, useState } from 'react'
import { useDakaStore, type Category } from '@/lib/store'
import { getStarsFromSales, getPremiumLabel } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Star, Package, Phone, Crown, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'

interface SellerListing {
  id: string
  title: string
  price: number
  unit: string
  quartier: string
  available: boolean
  isPremium: boolean
  category: Category
}

interface SellerProfile {
  id: string
  name: string
  phone: string
  quartier: string
  avatar: string | null
  rating: number
  sales: number
  premium: string
  premiumExpiry: string | null
  listings: SellerListing[]
}

interface SellerViewProps {
  sellerId: string
}

export function SellerView({ sellerId }: SellerViewProps) {
  const { setViewState, openModal } = useDakaStore()
  const [seller, setSeller] = useState<SellerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSeller()
  }, [sellerId])

  const loadSeller = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sellers?id=${sellerId}`)
      const data = await res.json()
      setSeller(data)
    } catch (error) {
      console.error('Failed to load seller:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        <div className="h-24 bg-muted rounded-xl animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vendeur non trouvé</p>
        <Button variant="outline" onClick={() => setViewState({ view: 'home' })} className="mt-4">
          Retour
        </Button>
      </div>
    )
  }

  const stars = getStarsFromSales(seller.sales)
  const premiumInfo = getPremiumLabel(seller.premium)

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => setViewState({ view: 'home' })} className="gap-1">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Button>

      {/* Seller profile card */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          <div className={`h-20 ${
            seller.premium === 'pro' ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
            seller.premium === 'basic' ? 'bg-gradient-to-r from-violet-400 to-purple-500' :
            'bg-gradient-to-r from-orange-400 to-red-500'
          }`} />
          <CardContent className="relative pt-0 pb-4 px-4">
            <div className="flex items-end gap-3 -mt-8 relative z-10">
              <Avatar className="w-16 h-16 border-4 border-white">
                <AvatarFallback className="bg-orange-100 text-orange-700 text-xl font-bold">
                  {seller.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{seller.name}</h2>
                  {premiumInfo && (
                    <Badge className="text-[10px] px-1.5 py-0" style={{
                      backgroundColor: `${premiumInfo.color}15`,
                      color: premiumInfo.color,
                      borderColor: `${premiumInfo.color}30`
                    }}>
                      {seller.premium === 'pro' ? <Crown className="w-3 h-3 mr-0.5" /> : <Star className="w-3 h-3 mr-0.5" />}
                      {premiumInfo.label}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-orange-500" />
                {seller.quartier}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {seller.phone}
              </span>
            </div>
            <div className="flex gap-3 mt-3 flex-wrap">
              {/* Stars based on sales */}
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                <div className="flex items-center gap-0.5 mr-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(stars) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                {stars.toFixed(1)}
              </Badge>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <ShoppingBag className="w-3 h-3 mr-1" />
                {seller.sales} ventes
              </Badge>
              <Badge variant="secondary">
                <Package className="w-3 h-3 mr-1" />
                {seller.listings.length} annonce{seller.listings.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Seller listings */}
      <div className="space-y-2">
        {seller.listings.map((listing) => (
          <Card
            key={listing.id}
            className={`hover:shadow-md transition-shadow cursor-pointer ${
              listing.isPremium ? 'ring-1 ring-amber-300/50 border-amber-200' : ''
            }`}
            onClick={() => openModal({ type: 'listingDetail', listingId: listing.id })}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: `${listing.category.color}15` }}
              >
                {listing.category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
                  {listing.isPremium && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground">{listing.category.name} • {listing.quartier}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-orange-600">{listing.price.toLocaleString('fr-FR')}</p>
                <p className="text-[10px] text-muted-foreground">FCFA / {listing.unit}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {seller.listings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucune annonce active</p>
          </div>
        )}
      </div>
    </div>
  )
}
