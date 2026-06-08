'use client'

import { useEffect, useState } from 'react'
import { useDakaStore, type Category } from '@/lib/store'
import { getStarsFromSales, getPremiumLabel } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Star, Package, Phone, Crown, ShoppingBag } from 'lucide-react'

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
      if (!res.ok) { setSeller(null); return }
      const data = await res.json()
      if (data.error) { setSeller(null); return }
      setSeller(data)
    } catch { setSeller(null) }
    finally { setLoading(false) }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        <div className="h-16 bg-muted rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vendeur non trouv&eacute;</p>
        <Button variant="outline" onClick={() => setViewState({ view: 'home' })} className="mt-4">Retour</Button>
      </div>
    )
  }

  const stars = getStarsFromSales(seller.sales)
  const premiumInfo = getPremiumLabel(seller.premium)

  return (
    <div className="space-y-3">
      {/* Breadcrumb - FunPay style */}
      <div className="flex items-center gap-2 text-xs">
        <button onClick={() => setViewState({ view: 'home' })} className="text-[#f5a623] hover:underline">Accueil</button>
        <span className="text-gray-400">/</span>
        <span className="font-semibold text-[#2a2d35]">Vendeur</span>
      </div>

      {/* Seller profile - compact FunPay style */}
      <div className="bg-white rounded border border-border p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#f5a623] flex items-center justify-center text-sm font-bold text-black">
            {seller.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#2a2d35]">{seller.name}</h2>
              {premiumInfo && (
                <Badge className="text-[9px] px-1.5 py-0 border-0" style={{
                  backgroundColor: `${premiumInfo.color}15`,
                  color: premiumInfo.color
                }}>
                  {premiumInfo.label}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {seller.quartier}</span>
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-2 h-2 ${i < Math.floor(stars) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
                <span className="ml-0.5">{seller.sales} ventes</span>
              </span>
              <span><Package className="w-2.5 h-2.5 inline mr-0.5" /> {seller.listings.length} annonces</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seller listings - FunPay row style */}
      <div className="bg-white rounded border border-border overflow-hidden">
        {seller.listings.map((listing, index) => (
          <div
            key={listing.id}
            className={`funpay-listing-row flex items-center gap-3 px-4 py-2.5 cursor-pointer ${index < seller.listings.length - 1 ? 'border-b border-border/40' : ''}`}
            onClick={() => openModal({ type: 'listingDetail', listingId: listing.id })}
          >
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-sm shrink-0"
              style={{ backgroundColor: `${listing.category.color}12` }}
            >
              {listing.category.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-[#2a2d35] truncate">{listing.title}</span>
                {listing.isPremium && <Crown className="w-3 h-3 text-[#f5a623] shrink-0" />}
              </div>
              <span className="text-[11px] text-gray-500">{listing.category.name} &bull; {listing.quartier}</span>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-sm text-[#2a2d35]">{listing.price.toLocaleString('fr-FR')}</span>
              <span className="text-[10px] text-gray-400 ml-0.5">FCFA/{listing.unit}</span>
            </div>
          </div>
        ))}
        {seller.listings.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Aucune annonce active</p>
          </div>
        )}
      </div>
    </div>
  )
}
