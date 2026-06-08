'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useDakaStore } from '@/lib/store'
import { getPremiumLabel } from '@/lib/constants'
import { Search, Store, LogOut, Plus, Menu, X, ShoppingCart, MapPin, User, Settings, ShoppingBag, Crown } from 'lucide-react'

export function Header() {
  const { seller, setSeller, openModal, setViewState, searchQuery, setSearchQuery } = useDakaStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const premiumInfo = seller ? getPremiumLabel(seller.premium) : null

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setSeller(null)
    setViewState({ view: 'home' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setViewState({ view: 'home' })
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[#2a2d35]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <button
          onClick={() => setViewState({ view: 'home' })}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f5a623] flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-white tracking-tight">
            FUNSHOP
          </span>
        </button>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-9 pr-4 bg-[#3a3d45] border-0 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#f5a623]/50 h-9 text-sm"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {seller ? (
            <>
              {seller.premium === 'none' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-white/10 h-8 text-xs"
                  onClick={() => openModal({ type: 'premium' })}
                >
                  <Crown className="w-3.5 h-3.5" />
                  Premium
                </Button>
              )}
              <Button
                size="sm"
                className="gap-1.5 bg-[#f5a623] hover:bg-[#e09520] text-black font-semibold h-8 text-xs"
                onClick={() => openModal({ type: 'createListing' })}
              >
                <Plus className="w-3.5 h-3.5" />
                Publier
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-white/10 h-8 w-8"
                onClick={() => openModal({ type: 'recentPurchases' })}
              >
                <ShoppingBag className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-[#f5a623] text-black text-xs font-bold">
                        {seller.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-white max-w-[80px] truncate">{seller.name}</span>
                    {premiumInfo && (
                      <Badge className="text-[9px] px-1 py-0 bg-white/20 text-yellow-300 border-0">
                        {premiumInfo.label}
                      </Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-semibold text-sm">{seller.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {seller.quartier}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setViewState({ view: 'seller', id: seller.id })}>
                    <User className="w-4 h-4 mr-2" />
                    Mes annonces
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openModal({ type: 'recentPurchases' })}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Achats r&eacute;cents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openModal({ type: 'premium' })}>
                    <Crown className="w-4 h-4 mr-2" />
                    Premium
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openModal({ type: 'settings' })}>
                    <Settings className="w-4 h-4 mr-2" />
                    Param&egrave;tres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    D&eacute;connexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/10 h-8"
                onClick={() => openModal({ type: 'login' })}
              >
                Connexion
              </Button>
              <Button
                size="sm"
                className="bg-[#f5a623] hover:bg-[#e09520] text-black font-semibold h-8"
                onClick={() => openModal({ type: 'register' })}
              >
                <Store className="w-3.5 h-3.5 mr-1" />
                Devenir vendeur
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2a2d35] border-t border-white/10 px-4 py-3 space-y-2">
          {seller ? (
            <>
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/10">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[#f5a623] text-black text-xs font-bold">
                    {seller.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-sm text-white">{seller.name}</p>
                    {premiumInfo && (
                      <Badge className="text-[9px] px-1 py-0 bg-white/20 text-yellow-300 border-0">
                        {premiumInfo.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{seller.quartier}
                  </p>
                </div>
              </div>
              <Button
                className="w-full justify-start gap-2 bg-[#f5a623] hover:bg-[#e09520] text-black font-semibold"
                onClick={() => { openModal({ type: 'createListing' }); setMobileMenuOpen(false) }}
              >
                <Plus className="w-4 h-4" /> Publier une annonce
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => { setViewState({ view: 'seller', id: seller.id }); setMobileMenuOpen(false) }}
              >
                <User className="w-4 h-4" /> Mes annonces
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => { openModal({ type: 'recentPurchases' }); setMobileMenuOpen(false) }}
              >
                <ShoppingBag className="w-4 h-4" /> Achats r&eacute;cents
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-yellow-400 hover:text-yellow-300 hover:bg-white/10"
                onClick={() => { openModal({ type: 'premium' }); setMobileMenuOpen(false) }}
              >
                <Crown className="w-4 h-4" /> Premium
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => { openModal({ type: 'settings' }); setMobileMenuOpen(false) }}
              >
                <Settings className="w-4 h-4" /> Param&egrave;tres
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" /> D&eacute;connexion
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => { openModal({ type: 'login' }); setMobileMenuOpen(false) }}
              >
                Connexion
              </Button>
              <Button
                className="w-full bg-[#f5a623] hover:bg-[#e09520] text-black font-semibold"
                onClick={() => { openModal({ type: 'register' }); setMobileMenuOpen(false) }}
              >
                <Store className="w-4 h-4 mr-1" /> Devenir vendeur
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
