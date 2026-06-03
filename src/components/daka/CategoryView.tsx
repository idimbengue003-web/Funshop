'use client'

import { useEffect, useState } from 'react'
import { useDakaStore, type Listing, type ListingStats, type QuartiBreakdown, type Category } from '@/lib/store'
import { ListingGrid } from './ListingGrid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package } from 'lucide-react'
import { motion } from 'framer-motion'

interface CategoryViewProps {
  slug: string
}

export function CategoryView({ slug }: CategoryViewProps) {
  const { categories, setViewState, sortBy, selectedQuartier } = useDakaStore()
  const [listings, setListings] = useState<Listing[]>([])
  const [stats, setStats] = useState<ListingStats | null>(null)
  const [quartiers, setQuartiers] = useState<QuartiBreakdown[]>([])
  const [loading, setLoading] = useState(true)

  const category = categories.find((c: Category) => c.slug === slug)

  useEffect(() => {
    loadListings()
  }, [slug, sortBy, selectedQuartier])

  const loadListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('category', slug)
      params.set('sort', sortBy)
      if (selectedQuartier) params.set('quartier', selectedQuartier)

      const res = await fetch(`/api/listings?${params.toString()}`)
      const data = await res.json()
      setListings(data.listings)
      setStats(data.stats)
      setQuartiers(data.quartiers)
    } catch (error) {
      console.error('Failed to load category listings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground">Catégorie non trouvée</p>
        <Button variant="outline" onClick={() => setViewState({ view: 'home' })} className="mt-4">
          Retour à l&apos;accueil
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Category header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Button variant="ghost" size="icon" onClick={() => setViewState({ view: 'home' })} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${category.color}15` }}
        >
          {category.icon}
        </div>
        <div>
          <h1 className="text-xl font-bold">{category.name}</h1>
          <p className="text-sm text-muted-foreground">Comparez les prix entre vendeurs</p>
        </div>
      </motion.div>

      {/* Listings */}
      <ListingGrid
        listings={listings}
        stats={stats}
        quartiers={quartiers}
        loading={loading}
      />
    </div>
  )
}
