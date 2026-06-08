'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useDakaStore, type Listing } from '@/lib/store'
import { getStarsFromSales, getPremiumLabel } from '@/lib/constants'
import { toast } from '@/hooks/use-toast'
import {
  MapPin, Star, ShoppingBag, Phone, Crown, Shield, MessageCircle
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
      if (!res.ok) { setListing(null); return }
      const data = await res.json()
      if (data.error) { setListing(null); return }
      setListing(data)
    } catch { setListing(null) }
    finally { setLoading(false) }
  }

  const handleBuy = async () => {
    if (!listing) return
    setPurchasing(true)
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id, buyerPhone: 'Client FUNSHOP' })
      })
      if (res.ok) {
        setPhoneRevealed(true)
        toast({ title: 'Achat effectu&eacute; !', description: `Vous pouvez contacter ${listing.seller.name}` })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'achat', variant: 'destructive' })
    } finally { setPurchasing(false) }
  }

  const handleViewSeller = () => {
    if (!listing) return
    closeModal()
    setViewState({ view: 'seller', id: listing.seller.id })
  }

  const stars = listing ? getStarsFromSales(listing.seller.sales) : 0
  const premiumInfo = listing ? getPremiumLabel(listing.seller.premium) : null

  return (
    <Dialog open={modal.type === 'listingDetail'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Chargement...</div>
        ) : listing ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${listing.category.color}12` }}
                >
                  {listing.category.icon}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-sm leading-tight text-[#2a2d35]">{listing.title}</DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[9px] h-4">{listing.category.name}</Badge>
                    {listing.isPremium && (
                      <Badge className="bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20 text-[9px] h-4">
                        <Crown className="w-2.5 h-2.5 mr-0.5" /> VIP
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Price - FunPay style prominent */}
            <div className="mt-2">
              <span className="text-xl font-extrabold text-[#2a2d35]">{listing.price.toLocaleString('fr-FR')}</span>
              <span className="text-xs text-gray-400 ml-1">FCFA / {listing.unit}</span>
            </div>

            {/* Description */}
            {listing.description && (
              <p className="text-xs text-gray-500">{listing.description}</p>
            )}

            <Separator />

            {/* Seller info - compact FunPay style */}
            <div className="flex items-center gap-3 p-2.5 rounded bg-gray-50">
              <div className="w-9 h-9 rounded bg-[#f5a623] flex items-center justify-center text-xs font-bold text-black shrink-0">
                {listing.seller.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <button onClick={handleViewSeller} className="font-medium text-xs text-[#2a2d35] hover:text-[#f5a623]">
                    {listing.seller.name}
                  </button>
                  {premiumInfo && (
                    <span className="text-[9px] font-bold" style={{ color: premiumInfo.color }}>
                      {premiumInfo.label}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                  <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {listing.quartier}</span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-2 h-2 ${i < Math.floor(stars) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-0.5 text-[10px]">({listing.seller.sales})</span>
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={handleViewSeller}>Profil</Button>
            </div>

            <Separator />

            {/* Phone number */}
            <div className="space-y-2">
              <h3 className="font-semibold text-xs flex items-center gap-2 text-[#2a2d35]">
                <Phone className="w-3.5 h-3.5" /> Contacter
              </h3>
              {phoneRevealed ? (
                <div className="flex items-center gap-2 p-2 rounded bg-green-50 border border-green-200">
                  <Phone className="w-3.5 h-3.5 text-green-600" />
                  <span className="font-bold text-green-700 text-sm">{listing.seller.phone}</span>
                  <a href={`tel:${listing.seller.phone}`} className="ml-auto">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-6 text-[10px]">
                      <Phone className="w-2.5 h-2.5 mr-1" /> Appeler
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded bg-gray-50 border border-border/60">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-mono text-gray-400 blur-sm select-none text-xs">{listing.seller.phone}</span>
                  <Badge variant="outline" className="ml-auto text-[9px] h-4"><Shield className="w-2.5 h-2.5 mr-0.5" /> Prot&eacute;g&eacute;</Badge>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-1">
              {!phoneRevealed ? (
                <Button
                  className="flex-1 bg-[#f5a623] hover:bg-[#e09520] text-black font-bold h-9 text-xs"
                  onClick={handleBuy}
                  disabled={purchasing}
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                  {purchasing ? 'Traitement...' : 'Acheter - Voir le num&eacute;ro'}
                </Button>
              ) : (
                <>
                  <a href={`tel:${listing.seller.phone}`} className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-9 text-xs">
                      <Phone className="w-3.5 h-3.5 mr-1.5" /> Appeler
                    </Button>
                  </a>
                  <a href={`https://wa.me/221${listing.seller.phone}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-9 text-xs">
                      <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> WhatsApp
                    </Button>
                  </a>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-gray-400 text-sm">Annonce non trouv&eacute;e</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
