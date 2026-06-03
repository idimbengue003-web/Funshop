import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const quartier = searchParams.get('quartier')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'recent'

    const where: Record<string, unknown> = { available: true }

    if (categorySlug) {
      const category = await db.category.findUnique({ where: { slug: categorySlug } })
      if (category) where.categoryId = category.id
    }

    if (quartier) {
      where.quartier = quartier
    }

    if (search) {
      where.title = { contains: search }
    }

    const orderBy: Record<string, string> =
      sort === 'price_asc' ? { price: 'asc' } :
      sort === 'price_desc' ? { price: 'desc' } :
      { createdAt: 'desc' }

    const listings = await db.listing.findMany({
      where,
      include: {
        seller: { select: { id: true, name: true, quartier: true, avatar: true, rating: true, sales: true } },
        category: { select: { id: true, name: true, slug: true, icon: true, color: true } }
      },
      orderBy,
      take: 100
    })

    // Get price stats for the current filters
    const priceStats = await db.listing.aggregate({
      where,
      _min: { price: true },
      _max: { price: true },
      _avg: { price: true },
      _count: true
    })

    // Get quartier breakdown
    const quartierBreakdown = await db.listing.groupBy({
      by: ['quartier'],
      where,
      _count: true,
      _avg: { price: true },
      _min: { price: true },
      orderBy: { _count: { quartier: 'desc' } }
    })

    return NextResponse.json({
      listings,
      stats: {
        min: priceStats._min.price,
        max: priceStats._max.price,
        avg: priceStats._avg.price ? Math.round(priceStats._avg.price) : null,
        total: priceStats._count
      },
      quartiers: quartierBreakdown
    })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
