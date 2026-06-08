import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, password } = body

    if (!phone || !password) {
      return NextResponse.json({ error: 'Téléphone et mot de passe requis' }, { status: 400 })
    }

    const seller = await db.seller.findFirst({ where: { phone } })
    if (!seller || seller.password !== password) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })
    }

    const response = NextResponse.json({
      id: seller.id,
      name: seller.name,
      phone: seller.phone,
      quartier: seller.quartier,
      avatar: seller.avatar,
      rating: seller.rating,
      sales: seller.sales,
      premium: seller.premium,
      premiumExpiry: seller.premiumExpiry
    })

    response.cookies.set('seller_id', seller.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
