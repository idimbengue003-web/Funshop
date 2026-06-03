'use client'

import { useDakaStore, type Category } from '@/lib/store'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'

export function CategoryGrid() {
  const { categories, setViewState } = useDakaStore()

  const handleCategoryClick = (slug: string) => {
    setViewState({ view: 'category', slug })
  }

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-orange-600" />
        <h2 className="text-xl font-bold">Catégories</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map((cat: Category, index: number) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleCategoryClick(cat.slug)}
            className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/50 bg-card hover:bg-muted/50 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
              {cat.icon}
            </span>
            <span className="text-sm font-semibold text-center leading-tight">{cat.name}</span>
            {cat._count && (
              <span className="text-xs text-muted-foreground">
                {cat._count.listings} annonce{cat._count.listings !== 1 ? 's' : ''}
              </span>
            )}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"
              style={{ backgroundColor: cat.color }}
            />
          </motion.button>
        ))}
      </div>
    </section>
  )
}
