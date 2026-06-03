'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useDakaStore, type Purchase } from '@/lib/store'
import { ShoppingBag, MapPin, Clock, Phone } from 'lucide-react'

export function RecentPurchasesModal() {
  const { modal, closeModal, seller } = useDakaStore()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (modal.type === 'recentPurchases' && seller) {
      loadPurchases()
    }
  }, [modal.type, seller])

  const loadPurchases = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/purchases')
      if (res.ok) {
        const data = await res.json()
        setPurchases(data)
      }
    } catch {
      console.error('Failed to load purchases')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Il y a quelques minutes'
    if (hours < 24) return `Il y a ${hours}h`
    if (days === 1) return 'Hier'
    return `Il y a ${days}j`
  }

  return (
    <Dialog open={modal.type === 'recentPurchases'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Achats récents
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Chargement...</div>
        ) : purchases.length === 0 ? (
          <div className="py-8 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="font-medium text-muted-foreground">Aucun achat pour le moment</p>
            <p className="text-sm text-muted-foreground">Les achats apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">{purchases.length} achat{purchases.length !== 1 ? 's' : ''} récent{purchases.length !== 1 ? 's' : ''}</p>
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="overflow-hidden">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{purchase.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {purchase.quartier}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(purchase.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-orange-600 text-sm">{purchase.price.toLocaleString('fr-FR')}</p>
                    <p className="text-[10px] text-muted-foreground">FCFA</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
