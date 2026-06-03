import { cookies } from 'next/headers'
import { db } from '@/lib/db'

export async function getCurrentSeller(): Promise<{
  id: string
  name: string
  phone: string
  quartier: string
  avatar: string | null
  rating: number
  sales: number
  premium: string
  premiumExpiry: Date | null
} | null> {
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_id')?.value
  if (!sellerId) return null

  const seller = await db.seller.findUnique({
    where: { id: sellerId },
    select: { id: true, name: true, phone: true, quartier: true, avatar: true, rating: true, sales: true, premium: true, premiumExpiry: true }
  })
  return seller
}
