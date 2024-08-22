import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'

export const Button = ({
  children,
  className,
  ...props
}: ComponentProps<'button'>): ReactElement => {
  return (
    <button
      className={cn(
        'nextra-button imp-transition-all active:imp-opacity-50',
        'imp-bg-primary-700/5 imp-border imp-border-black/5 imp-text-gray-600 hover:imp-text-gray-900 imp-rounded-md imp-p-1.5',
        'dark:imp-bg-primary-300/10 dark:imp-border-white/10 dark:imp-text-gray-400 dark:hover:imp-text-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
