'use client'

import { useEffect, useState } from 'react'
import { useDakaStore, type Category } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Star, Package, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

interface SellerListing {
  id: string
  title: string
  price: number
  unit: string
  quartier: string
  available: boolean
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
  listings: SellerListing[]
}

interface SellerViewProps {
  sellerId: string
}

export function SellerView({ sellerId }: SellerViewProps) {
  const { setViewState } = useDakaStore()
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

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => setViewState({ view: 'home' })} className="gap-1">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Button>

      {/* Seller profile card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-orange-400 to-red-500" />
          <CardContent className="relative pt-0 pb-4 px-4">
            <Avatar className="w-16 h-16 border-4 border-white -mt-8 relative z-10">
              <AvatarFallback className="bg-orange-100 text-orange-700 text-xl font-bold">
                {seller.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2">
              <h2 className="text-xl font-bold">{seller.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {seller.quartier}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {seller.phone}
                </span>
              </div>
              <div className="flex gap-3 mt-3">
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                  {seller.rating.toFixed(1)}
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Package className="w-3 h-3 mr-1" />
                  {seller.sales} ventes
                </Badge>
                <Badge variant="secondary">
                  {seller.listings.length} annonce{seller.listings.length !== 1 ? 's' : ''} active{seller.listings.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Seller listings */}
      <div className="space-y-2">
        {seller.listings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: `${listing.category.color}15` }}
              >
                {listing.category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
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
