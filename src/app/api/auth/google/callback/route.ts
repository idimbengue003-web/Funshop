import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/?auth=error', request.url))
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/?auth=error', request.url))
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_URL || 'https://funshop-phi.vercel.app'}/api/auth/google/callback`

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      console.error('Token exchange failed:', await tokenRes.text())
      return NextResponse.redirect(new URL('/?auth=error', request.url))
    }

    const tokenData = await tokenRes.json()
    const { id_token } = tokenData

    // Decode the ID token to get user info (simple JWT decode)
    const payload = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString())
    const googleId = payload.sub
    const email = payload.email
    const name = payload.name || email?.split('@')[0] || 'Utilisateur'
    const picture = payload.picture || null

    // Find or create seller
    let seller = await db.seller.findFirst({
      where: { googleId }
    })

    if (!seller) {
      // Check if email matches an existing phone (unlikely but safe)
      // Create new seller with Google info
      const phone = `google_${googleId}`
      seller = await db.seller.create({
        data: {
          name,
          phone,
          password: '',
          googleId,
          quartier: 'Dakar',
          avatar: picture,
        }
      })
    } else {
      // Update avatar if changed
      if (picture && seller.avatar !== picture) {
        seller = await db.seller.update({
          where: { id: seller.id },
          data: { avatar: picture, name }
        })
      }
    }

    // Set cookie and redirect to home
    const response = NextResponse.redirect(new URL('/?auth=google_success', request.url))
    response.cookies.set('seller_id', seller.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(new URL('/?auth=error', request.url))
  }
}
