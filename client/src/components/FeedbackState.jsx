import React from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

const ERROR_CONFIGS = {
  invalid_shape: {
    badge: 'Error',
    icon: '🥣',
    headline: 'Recipe Scrambled',
    body: 'Failed to format properly. Please retry.',
    primaryActionText: 'Retry',
    primaryActionType: 'retry',
    showReset: true,
  },
  ai_request_failed: {
    badge: 'Error',
    icon: '👨‍🍳',
    headline: 'AI Unavailable',
    body: 'Could not reach the model. Please retry.',
    primaryActionText: 'Retry',
    primaryActionType: 'retry',
    showReset: true,
  },
  timeout: {
    badge: 'Timeout',
    icon: '⏱',
    headline: 'Request Timed Out',
    body: 'Server took too long to respond.',
    primaryActionText: 'Retry',
    primaryActionType: 'retry',
    secondaryActionText: 'Wait',
    secondaryActionType: 'wait',
    showReset: true,
  },
  network_error: {
    badge: 'Offline',
    icon: '📡',
    headline: "You're Offline",
    body: 'Check your internet connection.',
    primaryActionText: 'Retry',
    primaryActionType: 'retry',
    showReset: true,
  },
  empty_recipe: {
    badge: 'Empty',
    icon: '📝',
    headline: 'No Recipe Found',
    body: 'Try adding a few more ingredients.',
    primaryActionText: 'Edit Ingredients',
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
      className="w-full space-y-6 bg-kitchen-surface border-kitchen-border text-parchment-100 shadow-candlelight animate-fadeIn overflow-hidden"
    >
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-kitchen-border pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-kitchen-card border border-kitchen-border text-terracotta-400 text-xs font-semibold uppercase tracking-wider shadow-stamp">
          <span>{config.icon}</span>
          <span>{config.badge}</span>
        </div>
        <span className="text-xs font-mono text-parchment-300/60">
          Code: {code}
        </span>
      </div>

      {/* Main Copy Area */}
      <div className="space-y-1.5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-parchment-100 break-words">
          {config.headline}
        </h2>
        <p className="text-parchment-200 text-sm sm:text-base leading-relaxed break-words">
          {config.body}
        </p>
        {error?.message && error.message !== config.body && (
          <p className="text-xs font-mono text-terracotta-400 bg-kitchen-bg/90 p-3 rounded-xl border border-kitchen-border mt-3 break-words">
            Note: {error.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-kitchen-border flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
        {config.showReset ? (
          <Button variant="ghost" size="sm" onClick={onReset} className="w-full sm:w-auto text-parchment-300">
            ← Ingredients
          </Button>
        ) : (
          <div></div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
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
