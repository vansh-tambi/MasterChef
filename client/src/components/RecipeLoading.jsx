import React from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

export function RecipeLoading({ onCancel }) {
  return (
    <Card accent={true} className="w-full space-y-7 sm:space-y-9 animate-fadeIn overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-panel-border pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-elevated border border-panel-border flex items-center justify-center text-xl animate-flicker shadow-glow">
            🔥
          </div>
          <span className="text-lg sm:text-xl font-display font-semibold text-ink">
            Crafting Recipe...
          </span>
        </div>

        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-ink-muted hover:text-ink"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Skeleton Header Area */}
      <div className="space-y-4 animate-pulse">
        <div className="flex gap-2.5">
          <div className="h-6 w-20 bg-elevated rounded-full border border-panel-border"></div>
          <div className="h-6 w-28 bg-elevated rounded-full border border-panel-border"></div>
        </div>
        <div className="h-10 sm:h-12 w-3/4 bg-elevated rounded-xl border border-panel-border"></div>
        <div className="h-4 w-5/6 bg-elevated/60 rounded"></div>
      </div>

      {/* Skeleton Servings Bar */}
      <div className="bg-canvas border border-panel-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-36 bg-elevated rounded"></div>
          <div className="h-3 w-52 bg-elevated/60 rounded"></div>
        </div>
        <div className="h-11 w-32 bg-elevated rounded-xl border border-panel-border"></div>
      </div>

      {/* Skeleton Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 animate-pulse pt-2">
        <div className="lg:col-span-5 space-y-3">
          <div className="h-4 w-40 bg-elevated rounded"></div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-elevated border border-panel-border rounded-xl p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-panel-border rounded"></div>
                <div className="h-4 w-14 bg-panel-border/70 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="h-4 w-48 bg-elevated rounded"></div>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="bg-elevated border border-panel-border rounded-xl p-4 flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-panel-border shrink-0"></div>
              <div className="space-y-2 flex-1 pt-1">
                <div className="h-4 w-full bg-panel-border rounded"></div>
                <div className="h-4 w-4/5 bg-panel-border/70 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default RecipeLoading
