import React from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

export function RecipeLoading({ onCancel }) {
  return (
    <Card accent={true} className="w-full space-y-7 sm:space-y-9 animate-fadeIn overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-kitchen-border pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kitchen-card border border-kitchen-border flex items-center justify-center text-xl animate-flicker shadow-candlelight">
            🔥
          </div>
          <span className="text-lg sm:text-xl font-display font-semibold text-parchment-100">
            Crafting Recipe...
          </span>
        </div>

        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-parchment-300 hover:text-parchment-100"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Skeleton Header Area */}
      <div className="space-y-4 animate-pulse">
        <div className="flex gap-2.5">
          <div className="h-6 w-20 bg-kitchen-card rounded-full border border-kitchen-border"></div>
          <div className="h-6 w-28 bg-kitchen-card rounded-full border border-kitchen-border"></div>
        </div>
        <div className="h-10 sm:h-12 w-3/4 bg-kitchen-card rounded-xl border border-kitchen-border"></div>
        <div className="h-4 w-5/6 bg-kitchen-card/60 rounded"></div>
      </div>

      {/* Skeleton Servings Bar */}
      <div className="bg-kitchen-bg/60 border border-kitchen-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-36 bg-kitchen-card rounded"></div>
          <div className="h-3 w-52 bg-kitchen-card/60 rounded"></div>
        </div>
        <div className="h-11 w-32 bg-kitchen-card rounded-xl border border-kitchen-border"></div>
      </div>

      {/* Skeleton Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 animate-pulse pt-2">
        <div className="lg:col-span-5 space-y-3">
          <div className="h-4 w-40 bg-kitchen-card rounded"></div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-kitchen-card border border-kitchen-border rounded-xl p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-kitchen-border rounded"></div>
                <div className="h-4 w-14 bg-kitchen-border/70 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="h-4 w-48 bg-kitchen-card rounded"></div>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="bg-kitchen-card border border-kitchen-border rounded-xl p-4 flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-kitchen-border shrink-0"></div>
              <div className="space-y-2 flex-1 pt-1">
                <div className="h-4 w-full bg-kitchen-border rounded"></div>
                <div className="h-4 w-4/5 bg-kitchen-border/70 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default RecipeLoading
