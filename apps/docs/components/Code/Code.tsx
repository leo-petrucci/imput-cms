import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'

export const Code = ({
  children,
  className,
  ...props
}: ComponentProps<'code'>): ReactElement => {
  const hasLineNumbers = 'data-line-numbers' in props
  return (
    <code
      className={cn(
        'imp-border-black imp-border-opacity-[0.04] imp-bg-opacity-[0.03] imp-bg-black imp-break-words imp-rounded-md imp-border imp-py-0.5 imp-px-[.25em] imp-text-[.9em]',
        'dark:imp-border-white/10 dark:imp-bg-white/10',
        hasLineNumbers && '[counter-reset:line]',
        className
      )}
      // always show code blocks in ltr
      dir="ltr"
      {...props}
    >
      {children}
    </code>
  )
}
