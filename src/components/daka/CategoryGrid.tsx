'use client'

import { useDakaStore, type Category } from '@/lib/store'
import { QUARTIERS } from '@/lib/constants'

export function CategoryGrid() {
  const { categories, setViewState } = useDakaStore()

  const handleCategoryClick = (slug: string) => {
    setViewState({ view: 'category', slug })
  }

  if (categories.length === 0) return null

  // Group categories into a FunPay-style grid - 4 columns on desktop
  return (
    <div className="space-y-4">
      {/* FunPay-style header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Toutes les cat&eacute;gories
        </h2>
        <span className="text-xs text-muted-foreground">{categories.length} cat&eacute;gories</span>
      </div>

      {/* FunPay-style 4-column category grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-1">
        {categories.map((cat: Category) => (
          <div key={cat.id} className="py-2.5 px-3 border-b border-border/60 hover:bg-white rounded-sm">
            {/* Category title - like FunPay game title */}
            <button
              onClick={() => handleCategoryClick(cat.slug)}
              className="flex items-center gap-2 w-full text-left group"
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="text-sm font-semibold text-[#2a2d35] group-hover:text-[#f5a623]">
                {cat.name}
              </span>
              {cat._count && cat._count.listings > 0 && (
                <span className="text-[10px] text-gray-400 ml-auto">
                  {cat._count.listings}
                </span>
              )}
            </button>
            {/* Sub-links - like FunPay game sub-categories */}
            <div className="ml-7 mt-0.5 flex flex-wrap gap-x-2 gap-y-0">
              <button
                onClick={() => handleCategoryClick(cat.slug)}
                className="text-[11px] text-gray-500 hover:text-[#f5a623] hover:underline"
              >
                Toutes les offres
              </button>
              <button
                onClick={() => {
                  setViewState({ view: 'category', slug: cat.slug })
                }}
                className="text-[11px] text-gray-500 hover:text-[#f5a623] hover:underline"
              >
                Par quartier
              </button>
              {cat._count && cat._count.listings > 0 && (
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="text-[11px] text-gray-500 hover:text-[#f5a623] hover:underline"
                >
                  Moins cher
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
