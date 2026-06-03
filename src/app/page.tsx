'use client'

import { useEffect, useState } from 'react'
import { useDakaStore, type Category } from '@/lib/store'
import { Header } from '@/components/daka/Header'
import { AuthModals } from '@/components/daka/AuthModals'
import { CreateListingModal } from '@/components/daka/CreateListingModal'
import { ListingDetailModal } from '@/components/daka/ListingDetailModal'
import { PremiumModal } from '@/components/daka/PremiumModal'
import { SettingsModal } from '@/components/daka/SettingsModal'
import { RecentPurchasesModal } from '@/components/daka/RecentPurchasesModal'
import { HomeView } from '@/components/daka/HomeView'
import { CategoryView } from '@/components/daka/CategoryView'
import { SellerView } from '@/components/daka/SellerView'
import { Button } from '@/components/ui/button'
import { Database, Loader2 } from 'lucide-react'

export default function Home() {
  const { viewState, categories, setCategories, setSeller } = useDakaStore()
  const [initialized, setInitialized] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [needsSeed, setNeedsSeed] = useState(false)

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      const catsRes = await fetch('/api/categories')
      const catsData = await catsRes.json()
      setCategories(catsData)

      if (catsData.length === 0) {
        setNeedsSeed(true)
      }

      try {
        const meRes = await fetch('/api/auth/me')
        if (meRes.ok) {
          const meData = await meRes.json()
          useDakaStore.getState().setSeller(meData)
        }
      } catch {
        // Not logged in
      }

      setInitialized(true)
    } catch (error) {
      console.error('Initialization failed:', error)
      setInitialized(true)
    }
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      console.log('Seed result:', data)

      const catsRes = await fetch('/api/categories')
      const catsData = await catsRes.json()
      setCategories(catsData)

      setNeedsSeed(false)
    } catch (error) {
      console.error('Seed failed:', error)
    } finally {
      setSeeding(false)
    }
  }

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🛒</span>
          </div>
          <p className="text-muted-foreground">Chargement de FUNSHOP...</p>
        </div>
      </div>
    )
  }

  if (needsSeed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Bienvenue sur FUNSHOP</h1>
          <p className="text-muted-foreground mb-6">
            La marketplace alimentaire de Dakar. Comparez les prix entre vendeurs de tous les quartiers.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/20"
            onClick={handleSeed}
            disabled={seeding}
          >
            {seeding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Chargement des données...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Charger les données de démonstration
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4">
        {viewState.view === 'home' && <HomeView />}
        {viewState.view === 'category' && <CategoryView slug={viewState.slug} />}
        {viewState.view === 'seller' && <SellerView sellerId={viewState.id} />}
      </main>

      <footer className="border-t bg-muted/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          FUNSHOP — La marketplace alimentaire de Dakar &copy; 2025
        </div>
      </footer>

      {/* Modals */}
      <AuthModals />
      <CreateListingModal />
      <ListingDetailModal />
      <PremiumModal />
      <SettingsModal />
      <RecentPurchasesModal />
    </div>
  )
}
