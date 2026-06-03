import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentSeller } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const seller = await getCurrentSeller()
    if (!seller) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    const body = await request.json()
    const { tier } = body // 'basic' or 'pro'

    if (!['basic', 'pro'].includes(tier)) {
      return NextResponse.json({ error: 'Tier invalide' }, { status: 400 })
    }

    const premiumExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    const updated = await db.seller.update({
      where: { id: seller.id },
      data: { premium: tier, premiumExpiry }
    })

    // Mark some listings as premium
    const listings = await db.listing.findMany({
      where: { sellerId: seller.id, available: true },
      take: tier === 'pro' ? 10 : 5
    })

    for (const listing of listings) {
      await db.listing.update({
        where: { id: listing.id },
        data: { isPremium: true }
      })
    }

    return NextResponse.json({
      premium: updated.premium,
      premiumExpiry: updated.premiumExpiry
    })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
