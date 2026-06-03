import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('seller_id', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 0
  })
  return response
}
