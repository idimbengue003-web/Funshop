'use client'

import { useEffect, useState } from 'react'
import { useDakaStore, type Listing, type ListingStats, type QuartiBreakdown } from '@/lib/store'
import { CategoryGrid } from './CategoryGrid'
import { ListingGrid } from './ListingGrid'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Flame, MapPin } from 'lucide-react'

export function HomeView() {
  const { categories, searchQuery, sortBy, selectedQuartier } = useDakaStore()
  const [recentListings, setRecentListings] = useState<Listing[]>([])
  const [recentStats, setRecentStats] = useState<ListingStats | null>(null)
  const [recentQuartiers, setRecentQuartiers] = useState<QuartiBreakdown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentListings()
  }, [sortBy, selectedQuartier, searchQuery])

  const loadRecentListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('sort', sortBy)
      if (selectedQuartier) params.set('quartier', selectedQuartier)
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/listings?${params.toString()}`)
      const data = await res.json()
      setRecentListings(data.listings)
      setRecentStats(data.stats)
      setRecentQuartiers(data.quartiers)
    } catch (error) {
      console.error('Failed to load listings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 p-6 md:p-10 text-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium text-white/80">Marché de Dakar</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold mb-2 leading-tight">
            Comparez les prix,<br />trouvez les meilleures offres
          </h1>
          <p className="text-sm md:text-base text-white/80 max-w-lg">
            Lait, viande, poisson, légumes, boissons... Tous les produits alimentaires de Dakar au même endroit. Comparez les prix entre les vendeurs de chaque quartier.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Yoff', 'Castor', 'Médina', 'Plateau', 'Ouakam'].map((q) => (
              <span key={q} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium backdrop-blur-sm">
                <MapPin className="w-3 h-3" />
                {q}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <CategoryGrid />

      {/* Recent listings */}
      <section className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-bold">
            {searchQuery ? `Résultats pour "${searchQuery}"` : 'Dernières annonces'}
          </h2>
        </div>
        <ListingGrid
          listings={recentListings}
          stats={recentStats}
          quartiers={recentQuartiers}
          loading={loading}
        />
      </section>
    </div>
  )
}
