import { create } from 'zustand'

export type Seller = {
  id: string
  name: string
  phone: string
  quartier: string
  avatar: string | null
  rating: number
  sales: number
  premium: string
  premiumExpiry?: string | null
}

export type Category = {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  _count?: { listings: number }
}

export type Listing = {
  id: string
  title: string
  description: string | null
  price: number
  unit: string
  imageUrl: string | null
  available: boolean
  isPremium: boolean
  quartier: string
  createdAt: string
  category: Category
  seller: Seller
  purchases?: Purchase[]
}

export type Purchase = {
  id: string
  buyerPhone: string
  listingId: string
  sellerId: string
  price: number
  title: string
  quartier: string
  createdAt: string
}

export type ListingStats = {
  min: number | null
  max: number | null
  avg: number | null
  total: number
}

export type QuartiBreakdown = {
  quartier: string
  _count: number
  _avg: { price: number | null }
  _min: { price: number | null }
}

type ViewState =
  | { view: 'home' }
  | { view: 'category'; slug: string }
  | { view: 'seller'; id: string }

type ModalState =
  | { type: 'closed' }
  | { type: 'login' }
  | { type: 'register' }
  | { type: 'createListing' }
  | { type: 'listingDetail'; listingId: string }
  | { type: 'premium' }
  | { type: 'settings' }
  | { type: 'recentPurchases' }

interface DakaStore {
  // Auth
  seller: Seller | null
  setSeller: (seller: Seller | null) => void

  // View
  viewState: ViewState
  setViewState: (state: ViewState) => void

  // Modal
  modal: ModalState
  openModal: (modal: ModalState) => void
  closeModal: () => void

  // Data
  categories: Category[]
  setCategories: (cats: Category[]) => void

  listings: Listing[]
  setListings: (listings: Listing[]) => void

  stats: ListingStats | null
  setStats: (stats: ListingStats | null) => void

  quartiers: QuartiBreakdown[]
  setQuartiers: (q: QuartiBreakdown[]) => void

  purchases: Purchase[]
  setPurchases: (p: Purchase[]) => void

  // Filters
  selectedQuartier: string | null
  setSelectedQuartier: (q: string | null) => void

  sortBy: string
  setSortBy: (s: string) => void

  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const useDakaStore = create<DakaStore>((set) => ({
  seller: null,
  setSeller: (seller) => set({ seller }),

  viewState: { view: 'home' },
  setViewState: (viewState) => set({ viewState }),

  modal: { type: 'closed' },
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: { type: 'closed' } }),

  categories: [],
  setCategories: (categories) => set({ categories }),

  listings: [],
  setListings: (listings) => set({ listings }),

  stats: null,
  setStats: (stats) => set({ stats }),

  quartiers: [],
  setQuartiers: (quartiers) => set({ quartiers }),

  purchases: [],
  setPurchases: (purchases) => set({ purchases }),

  selectedQuartier: null,
  setSelectedQuartier: (selectedQuartier) => set({ selectedQuartier }),

  sortBy: 'recent',
  setSortBy: (sortBy) => set({ sortBy }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}))
