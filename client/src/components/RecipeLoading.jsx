import React, { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

const KITCHEN_PHRASES = [
  'Sifting through the pantry staples...',
  'Balancing aromatic herbs and seasonings...',
  'Simmering step-by-step instructions...',
  'Calculating perfect cooking times and yields...',
  'Tasting the sauce for seasoning...',
]

export function RecipeLoading({ onCancel }) {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % KITCHEN_PHRASES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card accent={true} className="w-full max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Dynamic Culinary Micro-Copy Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500 animate-ping"></span>
          <span className="text-sm font-display italic text-terracotta-700 font-medium transition-all duration-300">
            {KITCHEN_PHRASES[phraseIndex]}
          </span>
        </div>

        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-charcoal-700 hover:text-charcoal-900 self-start sm:self-auto text-xs"
          >
            ✕ Cancel and return to pantry
          </Button>
        )}
      </div>

      {/* Skeleton Header Area */}
      <div className="space-y-4 animate-pulse">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-cream-200/90 rounded-full"></div>
          <div className="h-6 w-24 bg-cream-200/90 rounded-full"></div>
        </div>
        <div className="h-9 w-3/4 bg-cream-300/80 rounded-lg"></div>
        <div className="h-4 w-5/6 bg-cream-200/80 rounded"></div>
      </div>

      {/* Skeleton Servings Bar */}
      <div className="bg-cream-50/70 border border-cream-200 rounded-xl p-4 flex items-center justify-between animate-pulse">
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-cream-300/80 rounded"></div>
          <div className="h-3 w-48 bg-cream-200/80 rounded"></div>
        </div>
        <div className="h-8 w-24 bg-cream-200/90 rounded-lg"></div>
      </div>

      {/* Skeleton Ingredients Grid */}
      <div className="space-y-3 animate-pulse">
        <div className="h-4 w-40 bg-cream-300/80 rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-cream-50 border border-cream-200/80 rounded-lg p-3.5 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-cream-300/70 rounded"></div>
                <div className="h-4 w-12 bg-cream-200/80 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton Step Instructions */}
      <div className="space-y-3 animate-pulse pt-2">
        <div className="h-4 w-48 bg-cream-300/80 rounded"></div>
        <div className="space-y-2.5">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="bg-cream-50 border border-cream-200/80 rounded-xl p-4 flex items-start gap-3.5"
            >
              <div className="w-7 h-7 rounded-lg bg-cream-200 shrink-0"></div>
              <div className="space-y-2 flex-1 pt-1">
                <div className="h-3.5 w-full bg-cream-200/90 rounded"></div>
                <div className="h-3.5 w-4/5 bg-cream-200/70 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default RecipeLoading
