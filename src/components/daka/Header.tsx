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
    <header className="sticky top-0 z-50 bg-[#2a2d35] border-b border-[#3a3d45]">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-3">
        {/* Logo - FunPay style */}
        <button
          onClick={() => setViewState({ view: 'home' })}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-7 h-7 rounded bg-[#f5a623] flex items-center justify-center">
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">
            FUNSHOP
          </span>
        </button>

        {/* Search bar - FunPay style centered */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <Input
              className="pl-8 pr-4 bg-[#1a1c22] border border-[#3a3d45] text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#f5a623] h-8 text-xs rounded"
              placeholder="Rechercher parmi les catégories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Desktop actions - FunPay minimal style */}
        <div className="hidden md:flex items-center gap-1">
          {seller ? (
            <>
              {seller.premium === 'none' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-yellow-400 hover:text-yellow-300 hover:bg-white/5 h-7 text-[11px] px-2"
                  onClick={() => openModal({ type: 'premium' })}
                >
                  <Crown className="w-3 h-3" />
                  Premium
                </Button>
              )}
              <Button
                size="sm"
                className="gap-1 bg-[#f5a623] hover:bg-[#e09520] text-black font-semibold h-7 text-[11px] px-3 rounded"
                onClick={() => openModal({ type: 'createListing' })}
              >
                <Plus className="w-3 h-3" />
                Vendre
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-white/5 h-7 w-7"
                onClick={() => openModal({ type: 'recentPurchases' })}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/5">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-[#f5a623] text-black text-[10px] font-bold">
                        {seller.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-gray-300 max-w-[70px] truncate">{seller.name}</span>
                    {premiumInfo && (
                      <Badge className="text-[8px] px-1 py-0 bg-white/10 text-yellow-300 border-0 leading-none">
                        {premiumInfo.label}
                      </Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
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
                className="text-gray-400 hover:text-white hover:bg-white/5 h-7 text-[11px]"
                onClick={() => openModal({ type: 'login' })}
              >
                Connexion
              </Button>
              <Button
                size="sm"
                className="bg-[#f5a623] hover:bg-[#e09520] text-black font-semibold h-7 text-[11px] px-3 rounded"
                onClick={() => openModal({ type: 'register' })}
              >
                <Store className="w-3 h-3 mr-1" />
                Devenir vendeur
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/5 h-8 w-8"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2a2d35] border-t border-[#3a3d45] px-4 py-3 space-y-2">
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
                      <Badge className="text-[9px] px-1 py-0 bg-white/10 text-yellow-300 border-0">
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
                <Plus className="w-4 h-4" /> Vendre un produit
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-white/5"
                onClick={() => { setViewState({ view: 'seller', id: seller.id }); setMobileMenuOpen(false) }}
              >
                <User className="w-4 h-4" /> Mes annonces
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-white/5"
                onClick={() => { openModal({ type: 'recentPurchases' }); setMobileMenuOpen(false) }}
              >
                <ShoppingBag className="w-4 h-4" /> Achats r&eacute;cents
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-yellow-400 hover:text-yellow-300 hover:bg-white/5"
                onClick={() => { openModal({ type: 'premium' }); setMobileMenuOpen(false) }}
              >
                <Crown className="w-4 h-4" /> Premium
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-white/5"
                onClick={() => { openModal({ type: 'settings' }); setMobileMenuOpen(false) }}
              >
                <Settings className="w-4 h-4" /> Param&egrave;tres
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-white/5"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" /> D&eacute;connexion
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full text-gray-300 hover:text-white hover:bg-white/5"
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
