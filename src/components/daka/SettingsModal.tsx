'use client'

import { } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useDakaStore, type Purchase } from '@/lib/store'
import { getPremiumLabel } from '@/lib/constants'
import { toast } from '@/hooks/use-toast'
import {
  Settings, User, MapPin, Phone, Crown, ShoppingBag,
  Package, LogOut, ChevronRight, Bell
} from 'lucide-react'

export function SettingsModal() {
  const { modal, closeModal, seller, setSeller, openModal, setViewState } = useDakaStore()
  const premiumInfo = seller ? getPremiumLabel(seller.premium) : null

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setSeller(null)
    closeModal()
  }

  return (
    <Dialog open={modal.type === 'settings'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres
          </DialogTitle>
        </DialogHeader>

        {seller && (
          <div className="space-y-4">
            {/* Profile section */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Avatar className="w-14 h-14">
                <AvatarFallback className="bg-orange-100 text-orange-700 text-lg font-bold">
                  {seller.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{seller.name}</span>
                  {premiumInfo && (
                    <Badge className="text-[10px] px-1.5 py-0" style={{
                      backgroundColor: `${premiumInfo.color}15`,
                      color: premiumInfo.color
                    }}>
                      {premiumInfo.label}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {seller.quartier}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {seller.phone}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Menu items */}
            <div className="space-y-1">
              <button
                onClick={() => { closeModal(); setViewState({ view: 'seller', id: seller.id }) }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Package className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-left flex-1">
                  <span className="text-sm font-medium">Mes annonces</span>
                  <p className="text-xs text-muted-foreground">Gérer vos annonces en ligne</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => { closeModal(); openModal({ type: 'recentPurchases' }) }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left flex-1">
                  <span className="text-sm font-medium">Achats récents</span>
                  <p className="text-xs text-muted-foreground">Voir vos dernières transactions</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => { closeModal(); openModal({ type: 'premium' }) }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-left flex-1">
                  <span className="text-sm font-medium">Abonnement Premium</span>
                  <p className="text-xs text-muted-foreground">
                    {seller.premium === 'none' ? 'Passer Premium pour plus de visibilité' : `Abonnement ${seller.premium.toUpperCase()} actif`}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <span className="text-sm font-medium">Notifications</span>
                  <p className="text-xs text-muted-foreground">Gérer vos alertes</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <Separator />

            <Button
              variant="ghost"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
