'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDakaStore } from '@/lib/store'
import { QUARTIERS } from '@/lib/constants'
import { toast } from '@/hooks/use-toast'

export function AuthModals() {
  const { modal, closeModal, setSeller } = useDakaStore()
  const [loading, setLoading] = useState(false)

  // Login form
  const [loginPhone, setLoginPhone] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regQuartier, setRegQuartier] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone, password: loginPassword })
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Erreur', description: data.error, variant: 'destructive' })
        return
      }
      setSeller(data)
      closeModal()
      toast({ title: 'Bienvenue !', description: `Connecté en tant que ${data.name}` })
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          phone: regPhone,
          password: regPassword,
          quartier: regQuartier
        })
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Erreur', description: data.error, variant: 'destructive' })
        return
      }
      setSeller(data)
      closeModal()
      toast({ title: 'Bienvenue !', description: `Compte créé pour ${data.name}` })
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de création', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Login Modal */}
      <Dialog open={modal.type === 'login'} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Connexion Vendeur</DialogTitle>
            <DialogDescription>Connectez-vous pour gérer vos annonces</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="login-phone">Numéro de téléphone</Label>
              <Input
                id="login-phone"
                placeholder="77 123 45 67"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Mot de passe</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Votre mot de passe"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleLogin} disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <button
                className="text-primary font-semibold hover:underline"
                onClick={() => useDakaStore.getState().openModal({ type: 'register' })}
              >
                Créer un compte
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={modal.type === 'register'} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Créer un compte vendeur</DialogTitle>
            <DialogDescription>Rejoignez DakaMarket et vendez vos produits</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Nom complet</Label>
              <Input
                id="reg-name"
                placeholder="Votre nom"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-phone">Numéro de téléphone</Label>
              <Input
                id="reg-phone"
                placeholder="77 123 45 67"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Mot de passe</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Choisissez un mot de passe"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Quartier</Label>
              <Select value={regQuartier} onValueChange={setRegQuartier}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre quartier" />
                </SelectTrigger>
                <SelectContent>
                  {QUARTIERS.map((q) => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleRegister} disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Déjà inscrit ?{' '}
              <button
                className="text-primary font-semibold hover:underline"
                onClick={() => useDakaStore.getState().openModal({ type: 'login' })}
              >
                Se connecter
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
