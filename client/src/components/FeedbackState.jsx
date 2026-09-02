import React from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

const ERROR_CONFIGS = {
  invalid_shape: {
    badge: 'Recipe Jumbled',
    icon: '🥣',
    headline: 'The Recipe Came Back Scrambled',
    body: "The kitchen notes got a bit jumbled on their way to your table. Let's give it another stir.",
    primaryActionText: 'Try Again',
    primaryActionType: 'retry',
    showReset: true,
  },
  ai_request_failed: {
    badge: 'Kitchen Busy',
    icon: '👨‍🍳',
    headline: 'Kitchen Temporarily Busy',
    body: "We couldn't reach the recipe generator just now. Your ingredients are safe — let's try once more.",
    primaryActionText: 'Retry Request',
    primaryActionType: 'retry',
    showReset: true,
  },
  timeout: {
    badge: 'Simmering Slow',
    icon: '⏱',
    headline: 'Taking a Little Longer than Expected',
    body: 'The kitchen is working through complex notes. Would you like to wait a bit longer or fire it again?',
    primaryActionText: 'Try Again',
    primaryActionType: 'retry',
    secondaryActionText: 'Keep Waiting',
    secondaryActionType: 'wait',
    showReset: true,
  },
  network_error: {
    badge: 'Connection Lost',
    icon: '📡',
    headline: 'Pantry Disconnected',
    body: 'It looks like your internet connection slipped away. Reconnect and we will cook.',
    primaryActionText: 'Reconnect & Try Again',
    primaryActionType: 'retry',
    showReset: true,
  },
  empty_recipe: {
    badge: 'No Notes Found',
    icon: '📝',
    headline: 'No Recipe Formed',
    body: "The pantry notes didn't produce any actionable steps. Try adjusting your ingredients list with a few more details.",
    primaryActionText: 'Revise Ingredients',
    primaryActionType: 'reset',
    showReset: false,
  },
}

export function FeedbackState({ error, onRetry, onReset, onWait }) {
  const code = error?.code || 'ai_request_failed'
  const config = ERROR_CONFIGS[code] || ERROR_CONFIGS.ai_request_failed

  const handlePrimaryClick = () => {
    if (config.primaryActionType === 'reset') {
      onReset()
    } else {
      onRetry()
    }
  }

  return (
    <Card
      accent={true}
      className="w-full max-w-2xl mx-auto space-y-6 bg-cream-100 border-terracotta-200 text-charcoal-900 shadow-tactile animate-fadeIn"
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-cream-200 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-100 border border-terracotta-200 text-terracotta-700 text-xs font-semibold uppercase tracking-wider">
          <span>{config.icon}</span>
          <span>{config.badge}</span>
        </div>
        <span className="text-[11px] font-mono text-charcoal-500">
          Code: {code}
        </span>
      </div>

      {/* Main Copy Area */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900">
          {config.headline}
        </h2>
        <p className="text-charcoal-700 text-sm leading-relaxed">
          {config.body}
        </p>
        {error?.message && error.message !== config.body && (
          <p className="text-xs font-mono text-terracotta-700 bg-terracotta-100/60 p-2.5 rounded-md border border-terracotta-200/60 mt-3">
            Kitchen note: {error.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-cream-200 flex flex-wrap items-center justify-between gap-3">
        {config.showReset ? (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-charcoal-700">
            ← Return to Ingredients
          </Button>
        ) : (
          <div></div>
        )}

        <div className="flex items-center gap-2">
          {config.secondaryActionText && onWait && (
            <Button variant="outline" size="md" onClick={onWait}>
              {config.secondaryActionText}
            </Button>
          )}

          <Button variant="primary" size="md" onClick={handlePrimaryClick}>
            {config.primaryActionText}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default FeedbackState
