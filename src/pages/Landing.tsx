import React from 'react'
import { Home } from '../components/Home'

// Minimal wrapper that reuses Home's content but applies an attractive saffron-beige-green background
export default function Landing({ onNavigate }: any) {
  // We render the same Home component but the page-level background is handled here via wrapper
  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/60 via-beige/40 to-nature-green/60">
      <Home onNavigate={onNavigate} />
    </div>
  )
}
