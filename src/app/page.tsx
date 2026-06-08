'use client'

import { useEffect, useState } from 'react'
import { useDakaStore } from '@/lib/store'
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
import { Database, Loader2, ShoppingCart } from 'lucide-react'

export default function Home() {
  const { viewState, categories, setCategories, setSeller } = useDakaStore()
  const [initialized, setInitialized] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [needsSeed, setNeedsSeed] = useState(false)

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [viewState])

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      const catsRes = await fetch('/api/categories')
      if (!catsRes.ok) throw new Error('API error')
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
      setNeedsSeed(true)
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
      <div className="min-h-screen flex items-center justify-center bg-[#2a2d35]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#f5a623] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ShoppingCart className="w-6 h-6 text-black" />
          </div>
          <p className="text-gray-400 text-sm">Chargement de FUNSHOP...</p>
        </div>
      </div>
    )
  }

  if (needsSeed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2a2d35]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-[#f5a623] flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-xl font-extrabold mb-2 text-white">Bienvenue sur FUNSHOP</h1>
          <p className="text-gray-400 text-sm mb-6">
            La marketplace alimentaire de Dakar. Comparez les prix entre vendeurs de tous les quartiers.
          </p>
          <Button
            size="lg"
            className="bg-[#f5a623] hover:bg-[#e09520] text-black font-bold"
            onClick={handleSeed}
            disabled={seeding}
          >
            {seeding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Charger les donn&eacute;es
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4">
        {viewState.view === 'home' && <HomeView />}
        {viewState.view === 'category' && <CategoryView slug={viewState.slug} />}
        {viewState.view === 'seller' && <SellerView sellerId={viewState.id} />}
      </main>

      <footer className="bg-[#2a2d35] mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-2.5 text-center text-[11px] text-gray-500">
          FUNSHOP &mdash; La marketplace alimentaire de Dakar &copy; 2025
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
