import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, password, quartier } = body

    if (!name || !phone || !password || !quartier) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })
    }

    const existing = await db.seller.findFirst({ where: { phone } })
    if (existing) {
      return NextResponse.json({ error: 'Ce numéro de téléphone est déjà utilisé' }, { status: 400 })
    }

    const seller = await db.seller.create({
      data: { name, phone, password, quartier }
    })

    const response = NextResponse.json({
      id: seller.id,
      name: seller.name,
      phone: seller.phone,
      quartier: seller.quartier
    })

    response.cookies.set('seller_id', seller.id, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
