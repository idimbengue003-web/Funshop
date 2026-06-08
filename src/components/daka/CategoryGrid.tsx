'use client'

import { useDakaStore, type Category } from '@/lib/store'

export function CategoryGrid() {
  const { categories, setViewState } = useDakaStore()

  const handleCategoryClick = (slug: string) => {
    setViewState({ view: 'category', slug })
  }

  if (categories.length === 0) return null

  return (
    <div className="space-y-5">
      {/* FunPay-style category chips - all in a flow layout */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
          <span className="text-sm font-bold uppercase tracking-wide">Cat&eacute;gories</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat: Category) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-border hover:border-[#f5a623] hover:bg-amber-50/50 text-sm font-medium"
            >
              <span className="text-base">{cat.icon}</span>
              <span className="text-xs">{cat.name}</span>
              {cat._count && cat._count.listings > 0 && (
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0 rounded-full">
                  {cat._count.listings}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
