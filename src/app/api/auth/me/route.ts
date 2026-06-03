import { NextResponse } from 'next/server'
import { getCurrentSeller } from '@/lib/auth'

export async function GET() {
  try {
    const seller = await getCurrentSeller()
    if (!seller) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }
    return NextResponse.json(seller)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
