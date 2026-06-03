import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('id')

    if (sellerId) {
      const seller = await db.seller.findUnique({
        where: { id: sellerId },
        include: {
          listings: {
            where: { available: true },
            include: { category: true },
            orderBy: [{ isPremium: 'desc' }, { createdAt: 'desc' }]
          }
        }
      })
      if (!seller) {
        return NextResponse.json({ error: 'Vendeur non trouvé' }, { status: 404 })
      }
      const { password, ...sellerData } = seller
      return NextResponse.json(sellerData)
    }

    const sellers = await db.seller.findMany({
      select: {
        id: true, name: true, quartier: true, avatar: true, rating: true, sales: true, premium: true,
        _count: { select: { listings: { where: { available: true } } } }
      },
      orderBy: [
        { premium: 'desc' },
        { sales: 'desc' }
      ]
    })

    return NextResponse.json(sellers)
  } catch (error) {
    console.error('Sellers error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
