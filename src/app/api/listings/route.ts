import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const quartier = searchParams.get('quartier')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'recent'
    const premiumOnly = searchParams.get('premium') === 'true'

    const where: Record<string, unknown> = { available: true }

    if (premiumOnly) {
      where.isPremium = true
    }

    if (categorySlug) {
      const category = await db.category.findFirst({ where: { slug: categorySlug } })
      if (category) where.categoryId = category.id
    }

    if (quartier) {
      where.quartier = quartier
    }

    if (search) {
      const isPostgres = process.env.DATABASE_URL?.startsWith('postgres')
      where.title = isPostgres
        ? { contains: search, mode: 'insensitive' as const }
        : { contains: search }
    }

    const orderBy: Record<string, string> =
      sort === 'price_asc' ? { price: 'asc' } :
      sort === 'price_desc' ? { price: 'desc' } :
      { createdAt: 'desc' }

    if (premiumOnly) {
      // Simple query for premium listings on homepage
      const listings = await db.listing.findMany({
        where,
        include: {
          seller: { select: { id: true, name: true, phone: true, quartier: true, avatar: true, rating: true, sales: true, premium: true } },
          category: { select: { id: true, name: true, slug: true, icon: true, color: true } }
        },
        orderBy,
        take: 20
      })

      return NextResponse.json({ listings, stats: null, quartiers: [] })
    }

    // Full query for category view
    const premiumListings = await db.listing.findMany({
      where: { ...where, isPremium: true },
      include: {
        seller: { select: { id: true, name: true, phone: true, quartier: true, avatar: true, rating: true, sales: true, premium: true } },
        category: { select: { id: true, name: true, slug: true, icon: true, color: true } }
      },
      orderBy,
      take: 20
    })

    const regularListings = await db.listing.findMany({
      where: { ...where, isPremium: false },
      include: {
        seller: { select: { id: true, name: true, phone: true, quartier: true, avatar: true, rating: true, sales: true, premium: true } },
        category: { select: { id: true, name: true, slug: true, icon: true, color: true } }
      },
      orderBy,
      take: 80
    })

    const listings = [...premiumListings, ...regularListings]

    const priceStats = await db.listing.aggregate({
      where,
      _min: { price: true },
      _max: { price: true },
      _avg: { price: true },
      _count: true
    })

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
  } catch (error) {
    console.error('Listings error:', error)
    return NextResponse.json({
      listings: [],
      stats: { min: null, max: null, avg: null, total: 0 },
      quartiers: []
    })
  }
}
