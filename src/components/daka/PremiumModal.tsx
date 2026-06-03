'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useDakaStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { Crown, Star, Zap, Check, X } from 'lucide-react'

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
        toast({
          title: 'Premium activé !',
          description: `Votre abonnement ${tier === 'pro' ? 'PRO' : 'Premium'} est actif pour 30 jours`
        })
        closeModal()
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'activation', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={modal.type === 'premium'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-center flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            FUNSHOP Premium
          </DialogTitle>
          <DialogDescription className="text-center">
            Boostez vos ventes et gagnez en visibilité
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Basic Plan */}
          <Card className={`relative overflow-hidden ${seller?.premium === 'basic' ? 'ring-2 ring-violet-400' : 'border-border/50 hover:border-violet-200 hover:shadow-lg'} transition-all`}>
            {seller?.premium === 'basic' && (
              <div className="absolute top-0 right-0 bg-violet-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                ACTIF
              </div>
            )}
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-violet-500" />
                <span className="font-bold text-lg">Premium</span>
              </div>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl font-extrabold">1 000</span>
                <span className="text-sm text-muted-foreground mb-1">FCFA / mois</span>
              </div>

              <ul className="space-y-2 text-sm mb-5">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                  <span>5 annonces mises en avant</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                  <span>Badge <span className="text-violet-600 font-semibold">Premium</span> sur vos annonces</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                  <span>Annonces en première ligne</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                  <span>Statistiques de base</span>
                </li>
              </ul>

              {seller?.premium === 'basic' ? (
                <Button variant="outline" className="w-full" disabled>
                  Abonnement actif
                </Button>
              ) : (
                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                  onClick={() => handleSubscribe('basic')}
                  disabled={loading}
                >
                  {loading ? 'Activation...' : 'Choisir Premium'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className={`relative overflow-hidden ${seller?.premium === 'pro' ? 'ring-2 ring-amber-400' : 'border-border/50 hover:border-amber-200 hover:shadow-lg'} transition-all`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            {seller?.premium === 'pro' ? (
              <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                ACTIF
              </div>
            ) : (
              <div className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                POPULAIRE
              </div>
            )}
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-lg">PRO</span>
              </div>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl font-extrabold">5 000</span>
                <span className="text-sm text-muted-foreground mb-1">FCFA / mois</span>
              </div>

              <ul className="space-y-2 text-sm mb-5">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>10 annonces mises en avant</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Badge <span className="text-amber-600 font-semibold">PRO</span> + étoile dorée</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Toujours en première ligne</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Statistiques avancées</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Support prioritaire</span>
                </li>
              </ul>

              {seller?.premium === 'pro' ? (
                <Button variant="outline" className="w-full" disabled>
                  Abonnement actif
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20"
                  onClick={() => handleSubscribe('pro')}
                  disabled={loading}
                >
                  {loading ? 'Activation...' : 'Choisir PRO'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
