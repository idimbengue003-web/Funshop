import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentSeller } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const seller = await getCurrentSeller()
    if (!seller) {
      return NextResponse.json({ error: 'Vous devez être connecté' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, unit, categoryId, imageUrl } = body

    if (!title || !price || !unit || !categoryId) {
      return NextResponse.json({ error: 'Titre, prix, unité et catégorie sont requis' }, { status: 400 })
    }

    const listing = await db.listing.create({
      data: {
        title,
        description: description || null,
        price: parseInt(price),
        unit,
        categoryId,
        sellerId: seller.id,
        quartier: seller.quartier,
        imageUrl: imageUrl || null
      },
      include: {
        seller: { select: { id: true, name: true, quartier: true, avatar: true, rating: true, sales: true } },
        category: { select: { id: true, name: true, slug: true, icon: true, color: true } }
      }
    })

    return NextResponse.json(listing, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
