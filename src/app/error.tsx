'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">😕</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Oups, une erreur est survenue</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Quelque chose s&apos;est mal passé. Essayez de recharger la page.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold shadow-lg shadow-orange-500/20 hover:shadow-xl transition-shadow"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
