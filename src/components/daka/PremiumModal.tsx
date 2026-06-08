'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDakaStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { Crown, Star, Zap, Check, Diamond } from 'lucide-react'

export function PremiumModal() {
  const { modal, closeModal, seller, setSeller } = useDakaStore()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (tier: string) => {
    if (!seller) return
    setLoading(true)
    try {
      const res = await fetch('/api/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      })
      const data = await res.json()
      if (res.ok) {
        setSeller({ ...seller, premium: data.premium, premiumExpiry: data.premiumExpiry })
        const tierName = tier === 'vip' ? 'VIP' : tier === 'pro' ? 'PRO' : 'Premium'
        toast({ title: 'Premium activ&eacute; !', description: `Abonnement ${tierName} actif 30 jours` })
        closeModal()
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'activation', variant: 'destructive' })
    } finally { setLoading(false) }
  }

  return (
    <Dialog open={modal.type === 'premium'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-center flex items-center justify-center gap-2">
            <Crown className="w-5 h-5 text-[#f5a623]" />
            FUNSHOP Premium
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Boostez vos ventes et gagnez en visibilit&eacute;
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          {/* Premium - 2000 FCFA */}
          <Card className={`relative overflow-hidden ${seller?.premium === 'basic' ? 'ring-2 ring-violet-400' : 'border-border'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-violet-500" />
                <span className="font-bold">Premium</span>
              </div>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-2xl font-extrabold">2 000</span>
                <span className="text-xs text-muted-foreground mb-0.5">FCFA/mois</span>
              </div>
              <ul className="space-y-1.5 text-xs mb-4">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                  <span>Jusqu&apos;&agrave; <b>5 annonces</b> en avant</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                  <span>Badge <span className="text-violet-600 font-semibold">Premium</span></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                  <span>En premi&egrave;re ligne</span>
                </li>
              </ul>
              {seller?.premium === 'basic' ? (
                <Button variant="outline" className="w-full h-8 text-xs" disabled>Actif</Button>
              ) : (
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white h-8 text-xs" onClick={() => handleSubscribe('basic')} disabled={loading}>
                  {loading ? '...' : '2 000 FCFA'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* PRO - 5000 FCFA */}
          <Card className={`relative overflow-hidden ${seller?.premium === 'pro' ? 'ring-2 ring-[#f5a623]' : 'border-border'}`}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#f5a623]" />
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-[#f5a623]" />
                <span className="font-bold">PRO</span>
              </div>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-2xl font-extrabold">5 000</span>
                <span className="text-xs text-muted-foreground mb-0.5">FCFA/mois</span>
              </div>
              <ul className="space-y-1.5 text-xs mb-4">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#f5a623] shrink-0 mt-0.5" />
                  <span>Jusqu&apos;&agrave; <b>20 annonces</b> en avant</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#f5a623] shrink-0 mt-0.5" />
                  <span>Badge <span className="text-[#f5a623] font-semibold">PRO</span></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#f5a623] shrink-0 mt-0.5" />
                  <span>Toujours en premier</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#f5a623] shrink-0 mt-0.5" />
                  <span>Statistiques avanc&eacute;es</span>
                </li>
              </ul>
              {seller?.premium === 'pro' ? (
                <Button variant="outline" className="w-full h-8 text-xs" disabled>Actif</Button>
              ) : (
                <Button className="w-full bg-[#f5a623] hover:bg-[#e09520] text-black font-bold h-8 text-xs" onClick={() => handleSubscribe('pro')} disabled={loading}>
                  {loading ? '...' : '5 000 FCFA'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* VIP - 10 000 FCFA */}
          <Card className={`relative overflow-hidden ${seller?.premium === 'vip' ? 'ring-2 ring-emerald-400' : 'border-border'}`}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500" />
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Diamond className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">VIP</span>
              </div>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-2xl font-extrabold">10 000</span>
                <span className="text-xs text-muted-foreground mb-0.5">FCFA/mois</span>
              </div>
              <ul className="space-y-1.5 text-xs mb-4">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><b>Annonces illimit&eacute;es</b></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Badge <span className="text-emerald-600 font-semibold">VIP</span></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Meilleur placement</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
              {seller?.premium === 'vip' ? (
                <Button variant="outline" className="w-full h-8 text-xs" disabled>Actif</Button>
              ) : (
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-8 text-xs" onClick={() => handleSubscribe('vip')} disabled={loading}>
                  {loading ? '...' : '10 000 FCFA'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
