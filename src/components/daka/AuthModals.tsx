'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDakaStore } from '@/lib/store'
import { QUARTIERS } from '@/lib/constants'
import { toast } from '@/hooks/use-toast'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export function AuthModals() {
  const { modal, closeModal, setSeller } = useDakaStore()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Login form
  const [loginPhone, setLoginPhone] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regQuartier, setRegQuartier] = useState('')

  // Handle Google OAuth callback success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authStatus = params.get('auth')

    if (authStatus === 'google_success') {
      // Clean URL
      window.history.replaceState({}, '', '/')
      // Fetch the current seller (set by cookie from OAuth callback)
      fetch('/api/auth/me')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setSeller(data)
            toast({ title: 'Bienvenue !', description: `Connecté avec Google en tant que ${data.name}` })
          }
        })
        .catch(() => {})
    } else if (authStatus === 'error') {
      window.history.replaceState({}, '', '/')
      toast({ title: 'Erreur', description: 'Échec de la connexion Google', variant: 'destructive' })
    }
  }, [])

  const handleGoogleLogin = () => {
    setGoogleLoading(true)
    // Redirect to Google OAuth
    window.location.href = '/api/auth/google'
  }

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
            <DialogTitle className="text-lg font-bold">Connexion</DialogTitle>
            <DialogDescription>Connectez-vous pour gérer vos annonces</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            {/* Google Sign-In button */}
            <Button
              variant="outline"
              className="w-full h-10 gap-2 border-gray-300 hover:bg-gray-50 text-sm font-medium"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              <GoogleIcon className="w-4 h-4" />
              {googleLoading ? 'Redirection...' : 'Continuer avec Google'}
            </Button>

            {/* Divider */}
            <div className="relative flex items-center">
              <Separator className="flex-1" />
              <span className="mx-3 text-[11px] text-gray-400 uppercase">ou</span>
              <Separator className="flex-1" />
            </div>

            {/* Phone + Password form */}
            <div className="space-y-2">
              <Label htmlFor="login-phone" className="text-xs">Numéro de téléphone</Label>
              <Input
                id="login-phone"
                placeholder="77 123 45 67"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-xs">Mot de passe</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Votre mot de passe"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <Button className="w-full h-9 text-sm" onClick={handleLogin} disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Pas encore de compte ?{' '}
              <button
                className="text-[#f5a623] font-semibold hover:underline"
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
            <DialogTitle className="text-lg font-bold">Créer un compte vendeur</DialogTitle>
            <DialogDescription>Rejoignez FUNSHOP et vendez vos produits</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            {/* Google Sign-In button */}
            <Button
              variant="outline"
              className="w-full h-10 gap-2 border-gray-300 hover:bg-gray-50 text-sm font-medium"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              <GoogleIcon className="w-4 h-4" />
              {googleLoading ? 'Redirection...' : 'Continuer avec Google'}
            </Button>

            {/* Divider */}
            <div className="relative flex items-center">
              <Separator className="flex-1" />
              <span className="mx-3 text-[11px] text-gray-400 uppercase">ou</span>
              <Separator className="flex-1" />
            </div>

            {/* Manual registration */}
            <div className="space-y-2">
              <Label htmlFor="reg-name" className="text-xs">Nom complet</Label>
              <Input
                id="reg-name"
                placeholder="Votre nom"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-phone" className="text-xs">Numéro de téléphone</Label>
              <Input
                id="reg-phone"
                placeholder="77 123 45 67"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-xs">Mot de passe</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Choisissez un mot de passe"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Quartier</Label>
              <Select value={regQuartier} onValueChange={setRegQuartier}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Sélectionnez votre quartier" />
                </SelectTrigger>
                <SelectContent>
                  {QUARTIERS.map((q) => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full h-9 text-sm" onClick={handleRegister} disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Déjà inscrit ?{' '}
              <button
                className="text-[#f5a623] font-semibold hover:underline"
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
