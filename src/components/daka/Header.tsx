'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useDakaStore } from '@/lib/store'
import { Search, Store, LogOut, Plus, Menu, X, ShoppingCart, MapPin, User } from 'lucide-react'

export function Header() {
  const { seller, setSeller, openModal, setViewState, searchQuery, setSearchQuery } = useDakaStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <button
          onClick={() => setViewState({ view: 'home' })}
          className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              DakaMarket
            </span>
          </div>
        </button>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-2">
          <div className={`relative transition-all ${searchFocused ? 'scale-105' : ''}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 pr-4 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-orange-500/50"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </form>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {seller ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => openModal({ type: 'createListing' })}
              >
                <Plus className="w-4 h-4" />
                Publier
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-bold">
                        {seller.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[100px] truncate">{seller.name}</span>
                  </Button>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openModal({ type: 'login' })}
              >
                Connexion
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/20"
                onClick={() => openModal({ type: 'register' })}
              >
                <Store className="w-4 h-4 mr-1" />
                Devenir vendeur
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
          {seller ? (
            <>
              <div className="flex items-center gap-2 pb-2 mb-2 border-b">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-bold">
                    {seller.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{seller.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{seller.quartier}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => { openModal({ type: 'createListing' }); setMobileMenuOpen(false) }}
              >
                <Plus className="w-4 h-4" /> Publier une annonce
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => { setViewState({ view: 'seller', id: seller.id }); setMobileMenuOpen(false) }}
              >
                <User className="w-4 h-4" /> Mes annonces
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { openModal({ type: 'login' }); setMobileMenuOpen(false) }}
              >
                Connexion
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white"
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
