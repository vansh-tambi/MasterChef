import React from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

export function RecipeLoading({ onCancel }) {
  return (
    <Card accent={true} badge="PREPARING // SPEC 01" className="w-full space-y-7 sm:space-y-9 animate-fadeIn overflow-hidden">
      {/* Header Band */}
      <div className="flex items-center justify-between gap-4 border-b-2 border-panel-border pb-4 -mx-5 sm:-mx-8 px-5 sm:px-8 bg-elevated/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-surface border-2 border-panel-border flex items-center justify-center text-xl animate-flicker shadow-[2px_2px_0px_0px_rgba(26,29,32,0.15)] dark:shadow-[2px_2px_0px_0px_#000]">
            🔥
          </div>
          <span className="text-lg sm:text-xl font-display font-bold text-ink">
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
      <div className="space-y-3 animate-pulse">
        <div className="flex gap-2.5">
          <div className="h-6 w-20 bg-elevated rounded-sm border-2 border-panel-border"></div>
          <div className="h-6 w-28 bg-elevated rounded-sm border-2 border-panel-border"></div>
        </div>
        <div className="h-10 sm:h-12 w-3/4 bg-elevated rounded-md border-2 border-panel-border"></div>
        <div className="h-4 w-5/6 bg-elevated/60 rounded-sm"></div>
      </div>

      {/* Skeleton Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 animate-pulse pt-2 items-start">
        {/* Left 5 Cols */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-elevated/70 border-2 border-panel-border rounded-lg p-4 space-y-2">
            <div className="h-4 w-28 bg-panel-border rounded-sm"></div>
            <div className="h-10 w-full bg-surface border-2 border-panel-border rounded-md"></div>
          </div>

          <div className="space-y-3">
            <div className="h-4 w-36 bg-panel-border rounded-sm"></div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface border-2 border-panel-border rounded-md p-3 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-elevated rounded-sm"></div>
                  <div className="h-4 w-14 bg-elevated/70 rounded-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 7 Cols Timeline Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b-2 border-panel-border">
            <div className="h-4 w-24 bg-panel-border rounded-sm"></div>
            <div className="h-5 w-20 bg-elevated border border-panel-border rounded-sm"></div>
          </div>

          <div className="border-l-2 border-dashed border-panel-border ml-4 sm:ml-5 pl-6 sm:pl-7 relative space-y-5 pt-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="relative bg-surface border-2 border-panel-border rounded-md p-4 space-y-2"
              >
                <div className="absolute -left-[35px] sm:-left-[39px] top-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-elevated border-2 border-panel-border"></div>
                <div className="h-4 w-full bg-elevated rounded-sm"></div>
                <div className="h-4 w-4/5 bg-elevated/70 rounded-sm"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default RecipeLoading
