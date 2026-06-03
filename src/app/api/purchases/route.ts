import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentSeller } from '@/lib/auth'

export async function GET() {
  try {
    const seller = await getCurrentSeller()
    if (!seller) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    const purchases = await db.purchase.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json(purchases)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { listingId, buyerPhone } = body

    if (!listingId) {
      return NextResponse.json({ error: 'ID annonce requis' }, { status: 400 })
    }

    const listing = await db.listing.findUnique({
      where: { id: listingId },
      include: { seller: true }
    })

    if (!listing) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 })
    }

    const purchase = await db.purchase.create({
      data: {
        buyerPhone: buyerPhone || 'Non renseigné',
        listingId,
        sellerId: listing.sellerId,
        price: listing.price,
        title: listing.title,
        quartier: listing.quartier
      }
    })

    // Increment seller sales
    await db.seller.update({
      where: { id: listing.sellerId },
      data: { sales: { increment: 1 } }
    })

    return NextResponse.json(purchase, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
