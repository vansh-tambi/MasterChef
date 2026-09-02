import React from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

const ERROR_CONFIGS = {
  invalid_shape: {
    badge: 'Recipe Jumbled',
    icon: '🥣',
    headline: 'The Recipe Came Back Scrambled',
    body: "The culinary notes got a bit jumbled on their way to your table. Let's give it another stir.",
    primaryActionText: 'Try Again',
    primaryActionType: 'retry',
    showReset: true,
  },
  ai_request_failed: {
    badge: 'Kitchen Busy',
    icon: '👨‍🍳',
    headline: 'Master Chef Kitchen Temporarily Busy',
    body: "We couldn't reach the recipe generator just now. Your ingredients are safe — let's try once more.",
    primaryActionText: 'Retry Request',
    primaryActionType: 'retry',
    showReset: true,
  },
  timeout: {
    badge: 'Simmering Slow',
    icon: '⏱',
    headline: 'Taking a Little Longer than Expected',
    body: 'Master Chef is working through complex culinary steps. Would you like to wait a bit longer or fire it again?',
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
    body: 'It looks like your internet connection slipped away. Reconnect and Master Chef will cook.',
    primaryActionText: 'Reconnect & Try Again',
    primaryActionType: 'retry',
    showReset: true,
  },
  empty_recipe: {
    badge: 'No Notes Found',
    icon: '📝',
    headline: 'No Recipe Formed',
    body: "The pantry ingredients didn't produce any actionable steps. Try adjusting your ingredients list with a few more details.",
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
      className="w-full space-y-6 bg-cream-100 dark:bg-roast-900 border-terracotta-200 dark:border-terracotta-700/50 text-charcoal-900 dark:text-cream-100 shadow-tactile dark:shadow-none animate-fadeIn overflow-hidden"
    >
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-200 dark:border-roast-700 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-100 dark:bg-terracotta-900/40 border border-terracotta-200 dark:border-terracotta-700/60 text-terracotta-700 dark:text-terracotta-300 text-xs font-semibold uppercase tracking-wider">
          <span>{config.icon}</span>
          <span>{config.badge}</span>
        </div>
        <span className="text-xs font-mono text-charcoal-500 dark:text-cream-300/70">
          Code: {code}
        </span>
      </div>

      {/* Main Copy Area */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-cream-50 break-words">
          {config.headline}
        </h2>
        <p className="text-charcoal-700 dark:text-cream-200 text-sm sm:text-base leading-relaxed break-words">
          {config.body}
        </p>
        {error?.message && error.message !== config.body && (
          <p className="text-xs font-mono text-terracotta-700 dark:text-terracotta-300 bg-terracotta-100/60 dark:bg-roast-950 p-3 rounded-md border border-terracotta-200/60 dark:border-roast-700 mt-3 break-words">
            Kitchen note: {error.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-cream-200 dark:border-roast-700 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
        {config.showReset ? (
          <Button variant="ghost" size="sm" onClick={onReset} className="w-full sm:w-auto text-charcoal-700 dark:text-cream-200">
            ← Return to Ingredients
          </Button>
        ) : (
          <div></div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          {config.secondaryActionText && onWait && (
            <Button variant="outline" size="md" onClick={onWait} className="w-full sm:w-auto">
              {config.secondaryActionText}
            </Button>
          )}

          <Button variant="primary" size="md" onClick={handlePrimaryClick} className="w-full sm:w-auto">
            {config.primaryActionText}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default FeedbackState
