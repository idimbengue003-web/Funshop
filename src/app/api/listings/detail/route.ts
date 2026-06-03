import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const listing = await db.listing.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, name: true, phone: true, quartier: true, avatar: true, rating: true, sales: true, premium: true } },
        category: true,
        purchases: { orderBy: { createdAt: 'desc' }, take: 5 }
      }
    })

    if (!listing) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
