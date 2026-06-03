'use client'

import { useDakaStore, type Listing, type ListingStats, type QuartiBreakdown } from '@/lib/store'
import { ListingCard } from './ListingCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3, ArrowUpDown, Filter, TrendingDown, TrendingUp, Minus, X, Package } from 'lucide-react'
import { QUARTIERS } from '@/lib/constants'

interface ListingGridProps {
  listings: Listing[]
  stats: ListingStats | null
  quartiers: QuartiBreakdown[]
  loading?: boolean
  showFilters?: boolean
}

export function ListingGrid({ listings, stats, quartiers, loading, showFilters = true }: ListingGridProps) {
  const { sortBy, setSortBy, selectedQuartier, setSelectedQuartier } = useDakaStore()

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      {stats && stats.total > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
          <BarChart3 className="w-4 h-4 text-orange-600 shrink-0" />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">{stats.total} annonce{stats.total !== 1 ? 's' : ''}</span>
            {stats.min !== null && stats.max !== null && stats.min !== stats.max && (
              <>
                <span className="text-muted-foreground">|</span>
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <span className="text-green-700 font-semibold">{stats.min?.toLocaleString('fr-FR')}</span>
                  <span className="text-muted-foreground text-xs">FCFA</span>
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-red-500" />
                  <span className="text-red-600 font-semibold">{stats.max?.toLocaleString('fr-FR')}</span>
                  <span className="text-muted-foreground text-xs">FCFA</span>
                </span>
                {stats.avg && (
                  <>
                    <span className="text-muted-foreground">|</span>
                    <span className="flex items-center gap-1">
                      <Minus className="w-3 h-3 text-blue-500" />
                      Moy: <span className="text-blue-600 font-semibold">{stats.avg?.toLocaleString('fr-FR')}</span>
                      <span className="text-muted-foreground text-xs">FCFA</span>
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récent</SelectItem>
                <SelectItem value="price_asc">Prix croissant</SelectItem>
                <SelectItem value="price_desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedQuartier || '__all__'} onValueChange={(v) => setSelectedQuartier(v === '__all__' ? null : v)}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Tous les quartiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tous les quartiers</SelectItem>
                {QUARTIERS.map((q) => (
                  <SelectItem key={q} value={q}>{q}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedQuartier && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <MapPin className="w-3 h-3" />
              {selectedQuartier}
              <button onClick={() => setSelectedQuartier(null)}>
                <X className="w-3 h-3 ml-0.5 hover:text-destructive" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Quartier breakdown */}
      {quartiers.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {quartiers.slice(0, 8).map((q) => (
            <button
              key={q.quartier}
              onClick={() => setSelectedQuartier(q.quartier)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedQuartier === q.quartier
                  ? 'bg-orange-100 text-orange-700 border-orange-300'
                  : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted'
              }`}
            >
              <MapPin className="w-3 h-3" />
              {q.quartier}
              <span className="font-bold">{q._count}</span>
              {q._avg.price && (
                <span className="text-[10px] opacity-70">
                  ~{Math.round(q._avg.price).toLocaleString('fr-FR')} F
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Listings grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {listings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              index={index}
              stats={stats ?? undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucune annonce trouvée</p>
          <p className="text-sm">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  )
}

function MapPin({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
