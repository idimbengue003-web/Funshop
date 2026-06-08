'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useDakaStore, type Listing, type ListingStats, type QuartiBreakdown, type Category } from '@/lib/store'
import { ListingRow } from './ListingRow'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, ArrowRight, Package, Filter, ArrowUpDown, X, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { QUARTIERS } from '@/lib/constants'

const PAGE_SIZE = 20

interface CategoryViewProps {
  slug: string
}

export function CategoryView({ slug }: CategoryViewProps) {
  const { categories, setViewState, sortBy, setSortBy, selectedQuartier, setSelectedQuartier, searchQuery } = useDakaStore()
  const [listings, setListings] = useState<Listing[]>([])
  const [stats, setStats] = useState<ListingStats | null>(null)
  const [quartiers, setQuartiers] = useState<QuartiBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const abortRef = useRef<AbortController | null>(null)

  const category = categories.find((c: Category) => c.slug === slug)
  const categoryIndex = categories.findIndex((c: Category) => c.slug === slug)
  const prevCategory = categoryIndex > 0 ? categories[categoryIndex - 1] : null
  const nextCategory = categoryIndex < categories.length - 1 ? categories[categoryIndex + 1] : null

  const totalPages = Math.ceil(listings.length / PAGE_SIZE)
  const paginatedListings = useMemo(() =>
    listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [listings, page]
  )

  const loadListings = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)

    try {
      const params = new URLSearchParams()
      params.set('category', slug)
      params.set('sort', sortBy)
      if (selectedQuartier) params.set('quartier', selectedQuartier)
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/listings?${params.toString()}`, { signal: controller.signal })
      if (!res.ok) {
        setListings([])
        setStats(null)
        setQuartiers([])
        return
      }

      const data = await res.json()
      setListings(data.listings || [])
      setStats(data.stats || null)
      setQuartiers(data.quartiers || [])
      setPage(1)
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setListings([])
      setStats(null)
      setQuartiers([])
    } finally {
      setLoading(false)
    }
  }, [slug, sortBy, selectedQuartier, searchQuery])

  useEffect(() => {
    loadListings()
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [slug, sortBy, selectedQuartier, searchQuery])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  if (!category) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground">Cat&eacute;gorie non trouv&eacute;e</p>
        <Button variant="outline" onClick={() => setViewState({ view: 'home' })} className="mt-4">
          Retour
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-5">
      {/* Left sidebar - FunPay style category navigation */}
      <aside className="hidden lg:block w-48 shrink-0">
        <div className="sticky top-16 space-y-0.5">
          <button
            onClick={() => setViewState({ view: 'home' })}
            className="text-xs text-[#f5a623] hover:underline mb-2 block"
          >
            &larr; Toutes les cat&eacute;gories
          </button>
          <div className="bg-white rounded border border-border overflow-hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setViewState({ view: 'category', slug: cat.slug })}
                className={`w-full text-left px-3 py-1.5 text-xs border-b border-border/30 last:border-0 ${
                  cat.slug === slug
                    ? 'bg-[#f5a623]/10 text-[#2a2d35] font-semibold border-l-2 border-l-[#f5a623]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#2a2d35]'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
                {cat._count && cat._count.listings > 0 && (
                  <span className="text-gray-400 ml-1">({cat._count.listings})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Category header - FunPay breadcrumb style */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setViewState({ view: 'home' })}
            className="text-[#f5a623] hover:underline"
          >
            Accueil
          </button>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-[#2a2d35]">{category.icon} {category.name}</span>
          {stats && stats.total > 0 && (
            <span className="text-gray-400 text-[11px]">({stats.total} offres)</span>
          )}
        </div>

        {/* Filters bar - FunPay minimal style */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border/60">
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-gray-400" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px] h-7 text-[11px] border-border/60 rounded">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus r&eacute;cent</SelectItem>
                <SelectItem value="price_asc">Prix &#8593;</SelectItem>
                <SelectItem value="price_desc">Prix &#8595;</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-gray-400" />
            <Select value={selectedQuartier || '__all__'} onValueChange={(v) => setSelectedQuartier(v === '__all__' ? null : v)}>
              <SelectTrigger className="w-[120px] h-7 text-[11px] border-border/60 rounded">
                <SelectValue placeholder="Quartier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tous</SelectItem>
                {QUARTIERS.map((q) => (
                  <SelectItem key={q} value={q}>{q}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedQuartier && (
            <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
              <MapPin className="w-2.5 h-2.5" />
              {selectedQuartier}
              <button onClick={() => setSelectedQuartier(null)}>
                <X className="w-2.5 h-2.5 ml-0.5" />
              </button>
            </Badge>
          )}

          {stats && stats.min !== null && stats.max !== null && stats.min !== stats.max && (
            <span className="text-[11px] text-gray-400 ml-auto">
              {stats.min?.toLocaleString('fr-FR')} &mdash; {stats.max?.toLocaleString('fr-FR')} FCFA
            </span>
          )}
        </div>

        {/* Quartier pills - FunPay filter style */}
        {quartiers.length > 1 && (
          <div className="flex gap-1 overflow-x-auto pb-1">
            {quartiers.slice(0, 10).map((q) => (
              <button
                key={q.quartier}
                onClick={() => setSelectedQuartier(q.quartier)}
                className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedQuartier === q.quartier
                    ? 'bg-[#f5a623] text-black'
                    : 'bg-white border border-border/60 text-gray-500 hover:border-[#f5a623] hover:text-[#2a2d35]'
                }`}
              >
                <MapPin className="w-2.5 h-2.5" />
                {q.quartier}
                <span className="font-bold">{q._count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Loading skeletons */}
        {loading ? (
          <div className="bg-white rounded border border-border overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 last:border-0">
                <Skeleton className="w-8 h-8 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-3.5 w-36 mb-1" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : paginatedListings.length > 0 ? (
          <>
            {/* FunPay-style offer table */}
            <div className="bg-white rounded border border-border overflow-hidden">
              {paginatedListings.map((listing, index) => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  isLast={index === paginatedListings.length - 1}
                />
              ))}
            </div>

            {/* Pagination - FunPay minimal style */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="h-7 w-7 p-0 text-xs rounded"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                  if (pageNum > totalPages) return null
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      className={`h-7 w-7 p-0 text-xs rounded ${page === pageNum ? 'bg-[#2a2d35] hover:bg-[#3a3d45]' : ''}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="h-7 w-7 p-0 text-xs rounded"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-medium text-sm">Aucune offre trouv&eacute;e</p>
            <p className="text-xs">Essayez de modifier vos filtres</p>
          </div>
        )}

        {/* Category navigation - FunPay style bottom nav */}
        {(prevCategory || nextCategory) && (
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            {prevCategory ? (
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7" onClick={() => setViewState({ view: 'category', slug: prevCategory.slug })}>
                <ArrowLeft className="w-3 h-3" />
                {prevCategory.icon} {prevCategory.name}
              </Button>
            ) : <div />}
            {nextCategory ? (
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7" onClick={() => setViewState({ view: 'category', slug: nextCategory.slug })}>
                {nextCategory.name} {nextCategory.icon}
                <ArrowRight className="w-3 h-3" />
              </Button>
            ) : <div />}
          </div>
        )}
      </div>
    </div>
  )
}
