import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { platedSection } from '../utils/motionPresets'

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
  const shouldReduceMotion = useReducedMotion()
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
      badge="SYSTEM NOTICE"
      className="w-full space-y-6 overflow-hidden"
    >
      <motion.div
        variants={shouldReduceMotion ? undefined : platedSection}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        className="space-y-6"
      >
        {/* Header Band */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-panel-border pb-4 -mx-5 sm:-mx-8 px-5 sm:px-8 bg-elevated/40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-ember-500/10 border-2 border-ember-500/30 text-ember-500 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(26,29,32,0.12)]">
            <span>{config.icon}</span>
            <span>{config.badge}</span>
          </div>
          <span className="text-xs font-mono font-bold text-ink-muted bg-surface border border-panel-border px-2 py-0.5 rounded-sm">
            CODE: {code}
          </span>
        </div>

        {/* Main Copy Area */}
        <div className="space-y-2 pt-1">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink break-words">
            {config.headline}
          </h2>
          <p className="text-ink-secondary text-sm sm:text-base leading-relaxed break-words font-body">
            {config.body}
          </p>
          {error?.message && error.message !== config.body && (
            <p className="text-xs font-mono text-ember-500 bg-surface p-3.5 rounded-md border-2 border-panel-border mt-3 break-words shadow-inner">
              Note: {error.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t-2 border-panel-border flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
          {config.showReset ? (
            <Button variant="ghost" size="sm" onClick={onReset} className="w-full sm:w-auto text-ink-muted">
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
      </motion.div>
    </Card>
  )
}

export default FeedbackState
