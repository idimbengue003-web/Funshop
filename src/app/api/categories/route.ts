import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: { select: { listings: { where: { available: true } } } }
      },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
