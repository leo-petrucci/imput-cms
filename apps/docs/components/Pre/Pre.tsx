import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'
import { useCallback, useRef } from 'react'
import { WordWrapIcon } from '../Icons'
import { Button } from '../Button'
import { CopyToClipboard } from '../CopyToClipboard'

export const Pre = ({
  children,
  className,
  hasCopyCode,
  filename,
  ...props
}: ComponentProps<'pre'> & {
  filename?: string
  hasCopyCode?: boolean
}): ReactElement => {
  const preRef = useRef<HTMLPreElement | null>(null)

  const toggleWordWrap = useCallback(() => {
    const htmlDataset = document.documentElement.dataset
    const hasWordWrap = 'nextraWordWrap' in htmlDataset
    if (hasWordWrap) {
      delete htmlDataset.nextraWordWrap
    } else {
      htmlDataset.nextraWordWrap = ''
    }
  }, [])

  return (
    <div className="nextra-code-block imp-relative imp-mt-6 first:imp-mt-0">
      {filename && (
        <div className="imp-absolute imp-top-0 imp-z-[1] imp-w-full imp-truncate imp-rounded-t-xl imp-bg-primary-700/5 imp-py-2 imp-px-4 imp-text-xs imp-text-gray-700 dark:imp-bg-primary-300/10 dark:imp-text-gray-200">
          {filename}
        </div>
      )}
      <pre
        className={cn(
          'imp-bg-primary-700/5 imp-mb-4 imp-overflow-x-auto imp-rounded-xl imp-subpixel-antialiased dark:imp-bg-primary-300/10 imp-text-[.9em]',
          'contrast-more:imp-border contrast-more:imp-border-primary-900/20 contrast-more:imp-contrast-150 contrast-more:dark:imp-border-primary-100/40',
          filename ? 'imp-pt-12 imp-pb-4' : 'imp-py-4',
          className
        )}
        ref={preRef}
        {...props}
      >
        {children}
      </pre>
      <div
        className={cn(
          'imp-opacity-0 imp-transition [div:hover>&]:imp-opacity-100 focus-within:imp-opacity-100',
          'imp-flex imp-gap-1 imp-absolute imp-m-[11px] imp-right-0',
          filename ? 'imp-top-8' : 'imp-top-0'
        )}
      >
        <Button
          onClick={toggleWordWrap}
          className="md:imp-hidden"
          title="Toggle word wrap"
        >
          <WordWrapIcon className="imp-pointer-events-none imp-h-4 imp-w-4" />
        </Button>
        {hasCopyCode && (
          <CopyToClipboard
            getValue={() =>
              preRef.current?.querySelector('code')?.textContent || ''
            }
          />
        )}
      </div>
    </div>
  )
}
