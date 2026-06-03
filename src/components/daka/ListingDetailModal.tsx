'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useDakaStore, type Listing, type Seller } from '@/lib/store'
import { getStarsFromSales, getPremiumLabel } from '@/lib/constants'
import { toast } from '@/hooks/use-toast'
import {
  MapPin, Star, ShoppingBag, Phone, Eye, TrendingDown,
  TrendingUp, Minus, Crown, Shield, MessageCircle
} from 'lucide-react'

export function ListingDetailModal() {
  const { modal, closeModal, openModal, setViewState } = useDakaStore()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(false)
  const [phoneRevealed, setPhoneRevealed] = useState(false)
  const [purchasing, setPurchasing] = useState(false)

  const listingId = modal.type === 'listingDetail' ? modal.listingId : null

  useEffect(() => {
    if (listingId) {
      loadListing()
      setPhoneRevealed(false)
    }
  }, [listingId])

  const loadListing = async () => {
    if (!listingId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/listings/detail?id=${listingId}`)
      const data = await res.json()
      setListing(data)
    } catch {
      console.error('Failed to load listing')
    } finally {
      setLoading(false)
    }
  }

  const handleBuy = async () => {
    if (!listing) return
    setPurchasing(true)
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id, buyerPhone: 'Client DakaMarket' })
      })
      if (res.ok) {
        setPhoneRevealed(true)
        toast({
          title: 'Achat effectué !',
          description: `Vous pouvez maintenant contacter ${listing.seller.name}`
        })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'achat', variant: 'destructive' })
    } finally {
      setPurchasing(false)
    }
  }

  const handleViewSeller = () => {
    if (!listing) return
    closeModal()
    setViewState({ view: 'seller', id: listing.seller.id })
  }

  const stars = listing ? getStarsFromSales(listing.seller.sales) : 0
  const premiumInfo = listing ? getPremiumLabel(listing.seller.premium) : null

  const formatPhone = (phone: string, reveal: boolean) => {
    if (reveal) return phone
    return phone.slice(0, 4) + ' ** ** ' + phone.slice(-2)
  }

  return (
    <Dialog open={modal.type === 'listingDetail'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Chargement...</div>
        ) : listing ? (
          <>
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                  style={{ backgroundColor: `${listing.category.color}15` }}
                >
                  {listing.category.icon}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-lg leading-tight">{listing.title}</DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs" style={{
                      backgroundColor: `${listing.category.color}15`,
                      color: listing.category.color
                    }}>
                      {listing.category.name}
                    </Badge>
                    {listing.isPremium && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                        <Crown className="w-3 h-3 mr-0.5" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Price */}
            <div className="mt-2">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-extrabold text-orange-600">
                  {listing.price.toLocaleString('fr-FR')}
                </span>
                <span className="text-sm text-muted-foreground mb-1">FCFA / {listing.unit}</span>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <p className="text-sm text-muted-foreground mt-2">{listing.description}</p>
            )}

            <Separator className="my-3" />

            {/* Seller info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">
                  {listing.seller.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleViewSeller}
                    className="font-semibold text-sm hover:text-orange-600 transition-colors"
                  >
                    {listing.seller.name}
                  </button>
                  {premiumInfo && (
                    <Badge className="text-[10px] px-1.5 py-0" style={{
                      backgroundColor: `${premiumInfo.color}15`,
                      color: premiumInfo.color,
                      borderColor: `${premiumInfo.color}30`
                    }}>
                      {premiumInfo.label}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    {listing.quartier}
                  </span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(stars) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-1">({listing.seller.sales} ventes)</span>
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleViewSeller}>
                Voir profil
              </Button>
            </div>

            <Separator className="my-3" />

            {/* Phone number - blurred */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contacter le vendeur
              </h3>

              {phoneRevealed ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-lg text-green-700">{listing.seller.phone}</span>
                  <a
                    href={`tel:${listing.seller.phone}`}
                    className="ml-auto"
                  >
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <Phone className="w-3 h-3 mr-1" />
                      Appeler
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="font-mono text-lg tracking-wider text-muted-foreground blur-sm select-none">
                    {listing.seller.phone}
                  </span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Protégé
                  </Badge>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-2">
              {!phoneRevealed ? (
                <Button
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20"
                  size="lg"
                  onClick={handleBuy}
                  disabled={purchasing}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {purchasing ? 'Traitement...' : 'Acheter - Voir le numéro'}
                </Button>
              ) : (
                <>
                  <a href={`tel:${listing.seller.phone}`} className="flex-1">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/221${listing.seller.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                      size="lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground">Annonce non trouvée</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
